'use strict';

let mongoose = require('mongoose'),
    https = require('https'),
    chalk = require('chalk'),
    crypto = require('crypto'),
    authController = require('./authorization.controller.js'),
    errorHandler = require('./error.controller.js'),
    config = require('../config/development'),
    utilCtrl = require('./util.controller');

let User = mongoose.model('User'),
    Promotion = mongoose.model('Promotion'),
    Voucher = mongoose.model('Voucher');

let defaultErrorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!',
    defaultSuccessMessage = 'Thực hiện thành công',
    defaultPageSize = 15;

// Check user info is valid or invalid
function isValidUser(user) {
    // Wrong role
    if (!user.role || (user.role != 'NORMAL' && user.role != 'PROVIDER'))
        return false;

    if (!user.provider || (user.provider != 'vcoupon' && user.provider != 'facebook' && user.provider != 'google'))
        return false;

    if (!user.name || !user.email || !user.phoneNumber || !user.password)
        return false;

    // Provider user
    if (user.role == 'PROVIDER') {
        if (!user.address)
            return false;
    }

    return true;
}

/**
 * Remove sensitive info of user. User can't update that
 * @param user
 */
function removeNotAllowedInfo(user) {
    delete user.accessToken;
    delete user.salt;
    delete user.subscribingTopic;
    delete user.pinnedPromotion;
    delete user.providerId;
    delete user.nameNormalize;
    user.promotionCount = 0;
    user.followingCount = 0;
    user.followedCount = 0;
    user.rating = 0;

    return user;
}

function removeNotAllowedInfoWhenUpdateProfile(user) {
    user = removeNotAllowedInfo(user);
    delete user.password;
    delete user.phoneNumber;

    return user;
}

// Save token and response user info
function responseUserInfo(res, user, token) {
    User.findOneAndUpdate({_id: user._id}, {$set: {accessToken: token}}, {new: true}, function (err, newUser) {
        if (err) {
            errorHandler.sendErrorMessage(res, 422, defaultErrorMessage, errorHandler.getErrorMessage(err));
        } else {
            console.log(newUser);
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                user: newUser.toJSON()
            });
        }
    });
}

// Save token and response user info
function responseFBUserInfo(res, user, token) {
    User.findOneAndUpdate({_id: user._id}, {$set: {accessToken: token}}, {new: true}, function (err, newUser) {
        if (err) {
            errorHandler.sendErrorMessage(res, 422, defaultErrorMessage, errorHandler.getErrorMessage(err));
        } else {
            console.log(newUser);
            res.status(202).json({
                success: false,
                resultMessage: 'Người dùng này chưa có số điện thoại',
                user: newUser.toJSON()
            });
        }
    });
}

// Check promotion is pinned or not
function isPinned(promotionId, pinnedPromotion) {
    for (let i = 0; i < pinnedPromotion.length; i++) {
        if (pinnedPromotion[i] == promotionId)
            return true;
    }
    return false;
}

/**
 * Sign up new account
 * @param req: Request body
 * @param res: Response
 */
module.exports.signUp = (req, res) => {
    // Check request data
    if (!isValidUser(req.body)) {
        errorHandler.sendErrorMessage(res, 400,
            'Bạn chưa điền số điện thoại hoặc mật khẩu', []);
        return;
    }

    req.body = removeNotAllowedInfo(req.body);

    User.findOne({phoneNumber: req.body.phoneNumber}, (err, user) => {
        // Has an error when find user
        if (err) {
            errorHandler.sendSystemError(res, err);
        }

        // Existing the same user in database
        else if (user) {
            errorHandler.sendErrorMessage(res, 409,
                'Số điện thoại này đã được đăng ký. ' +
                'Vui lòng đăng nhập hoặc tạo tài khoản bằng số điện thoại khác', []);
        }

        // Create new account
        else {
            //let userInfo = removeNotAllowedInfo(req.body);
            User.create(req.body, function (err, user) {
                if (err || !user) {
                    errorHandler.sendSystemError(res, err);
                }
                else {
                    let token = authController.getAccessToken(user);
                    responseUserInfo(res, user, token);
                }
            });
        }
    });
};

/**
 * Sign in account
 * @param req: Request body
 * @param res
 */
module.exports.signIn = (req, res) => {
    // Check request data
    if (!req.body.phoneNumber || !req.body.password) {
        errorHandler.sendErrorMessage(res, 400, 'Bạn chưa điền số điện thoại hoặc mật khẩu', []);
        return;
    }

    // Authenticate user
    User.findOne({phoneNumber: req.body.phoneNumber},
        function (err, user) {
            // Has an error when find user
            if (err)
                return errorHandler.sendSystemError(res, err);

            // Wrong email or password
            if (!user)
                return errorHandler.sendErrorMessage(res, 401, 'Số điện thoại này không tồn tại', []);

            if (user.authenticate(req.body.password)) {
                let token = authController.getAccessToken(user);

                if (token) {
                    responseUserInfo(res, user, token);
                } else {
                    errorHandler.sendSystemError(res, err);
                }
            } else {
                errorHandler.sendErrorMessage(res, 401, 'Sai mật khẩu đăng nhập', []);
            }
        });
};

/***
 * Sign in with Facebook
 * @param req
 * @param res
 */
module.exports.signInWithFacebook = (req, res) => {
    let accessToken = req.body.fbAccessToken;
    console.log(accessToken);

    if (!accessToken) {
        errorHandler.sendErrorMessage(res, 400, 'Thiếu thông tin đăng nhập từ Facebook', []);
        return;
    }

    https.get(config.facebook.graphUrl + accessToken, (graphRes) => {
        let resData = '';

        graphRes.on('data', (chunk) => {
            resData += chunk;
        });

        graphRes.on('end', () => {
            let fbUser = JSON.parse(resData);
            if (fbUser.error) {
                return res.status(422).json({message: fbUser.error.message});
            }

            authenticateFacebookUser(fbUser, req, res);
        })
    });
};

// Authenticate facebook user
function authenticateFacebookUser(fbUser, req, res) {
    let userFBId = fbUser.id;

    User.findOne({providerId: userFBId, provider: 'facebook'}, (err, user) => {
        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        // User has phone number
        if (user && user.phoneNumber != 'USER_NO_PHONE_NUMBER') {
            let accessToken = authController.getAccessToken(user);
            responseUserInfo(res, user, accessToken);
            return;
        }

        // If user has no phone number, server will return user phone number that is USER_NO_PHONE_NUMBER string
        if (user) {
            let accessToken = authController.getAccessToken(user);
            responseFBUserInfo(res, user, accessToken);
            return;
        }

        // fields=id,name,email,gender,location,picture.width(100).height(100)&access_token="
        let newUser = {
            provider: 'facebook',
            providerId: fbUser.id,
            role: 'NORMAL'
        };

        newUser.email = fbUser.email;
        newUser.name = fbUser.name;
        newUser.avatar = fbUser.picture.data.url;
        
        newUser.address = 'Hồ Chí Minh, Việt Nam';
        if (fbUser.location && fbUser.location.name)
            newUser.address = fbUser.location.name;
        
        newUser.phoneNumber = 'USER_NO_PHONE_NUMBER';
        newUser.password = crypto.randomBytes(16).toString('base64');

        if (fbUser.gender == 'male')
            newUser.gender = 'Nam';
        else if (fbUser.gender == 'female')
            newUser.gender = 'Nữ';
        else
            newUser.gender = 'Khác';

        newUser = new User(newUser);
        newUser.save((err, u) => {
            if (err) {
                return errorHandler.sendSystemError(res, err);
            }

            let accessToken = authController.getAccessToken(u);
            responseFBUserInfo(res, u, accessToken);
        })
    });
}

/**
 * Update user phone number
 */
module.exports.updatePhoneNumber = (req, res) => {
    let userId = req.params.userId;
    let phoneNumber = req.body.phoneNumber;

    if (!phoneNumber || !userId) {
        return errorHandler.sendErrorMessage(res, 400, 'Thiếu thông tin', []);
    }

    User.findOne({phoneNumber: phoneNumber}, (err, user) => {
        if (err)
            return errorHandler.sendSystemError(res, err);

        if (user)
            return errorHandler.sendErrorMessage(res, 422, 'Số điện thoại này đã được sử dụng', []);

        User.findOneAndUpdate({_id: userId}, {$set: {phoneNumber: phoneNumber}}, {new: true}, (err, updatedUser) => {
            if (err)
                return errorHandler.sendSystemError(res, err);

            if (!updatedUser)
                return errorHandler.sendErrorMessage(res, 422, 'Người dùng không tồn tại', []);

            let accessToken = authController.getAccessToken(updatedUser);
            responseUserInfo(res, updatedUser, accessToken);
        })
    });
};

/***
 * Get user info
 * @param req
 * @param res
 */
module.exports.getUserInfo = (req, res) => {
    User.findOne({_id: req.params.userId}, function (err, user) {
        if (err || !user) {
            errorHandler.sendErrorMessage(res, 404,
                'Người dùng này không tồn tại', []);
        }
        else {
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                user: user.toJSONPublicProfile()
            });
        }
    });
};

/**
 * Follow a promotion provider or promotion category
 * @param req
 * @param res
 */
module.exports.followPromotionProvider = (req, res) => {
    // Check data request
    if (!req.params.userId || !req.body._publisherId || !req.body.subscribeType) {
        errorHandler.sendErrorMessage(res, 400, 'Thiếu thông tin. Vui lòng kiểm tra lại', []);
        return;
    }

    if (req.params.userId == req.body._publisherId) {
        errorHandler.sendErrorMessage(res, 400, "Bạn không thể tự theo dõi mình được.", []);
        return;
    }

    let subscribeInfo = {
        _publisherId: req.body._publisherId,
        subscribeType: req.body.subscribeType
    };

    User.findOne({_id: req.params.userId}, (err, user) => {
        if (err || !user) {
            errorHandler.sendErrorMessage(res, 404, defaultErrorMessage, []);
        } else {
            // Check duplicate following
            for (let i = 0; i < user.subscribingTopic.length; i++) {
                let provider = user.subscribingTopic[i];
                if (provider._publisherId == subscribeInfo._publisherId
                    && provider.subscribeType == subscribeInfo.subscribeType) {
                    errorHandler.sendErrorMessage(res, 400, 'Bạn đã theo dõi nhà cung cấp/ thể loại khuyến mại này.', []);
                    return;
                }
            }

            // Update user following promotion provider / promotion category
            user.subscribingTopic.push(subscribeInfo);
            user.followingCount++;

            User.update({_id: user._id}, {
                $set: {
                    subscribingTopic: user.subscribingTopic,
                    followingCount: user.followingCount
                }
            }, (err) => {
                if (err) {
                    errorHandler.sendSystemError(res, err);
                } else {
                    res.status(200).json({success: true, resultMessage: 'Theo dõi thành công!'});
                }
            });
        }
    });
};

module.exports.getFollows = (req, res) => {
    User.findOne({_id: req.params.userId}, (err, user) => {
        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        // User not found
        if (!user) {
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
            return;
        }

        res.status(200).json({
            success: true,
            resultMessage: defaultSuccessMessage,
            subscribingTopic: user.subscribingTopic
        });
    });
};

/**
 * Unfollow a promotion provider or promotion category
 * @param req
 * @param res
 */
module.exports.unfollowPromotionProvider = (req, res) => {
    // Check data request
    if (!req.params.userId || !req.params.publisherId) {
        errorHandler.sendErrorMessage(res, 404, 'Thiếu thông tin. Vui lòng kiểm tra lại', []);
        return;
    }

    if (req.params.userId == req.params.publisherId) {
        errorHandler.sendErrorMessage(res, 400, "Bạn không thể tự theo dõi mình được.", []);
        return;
    }

    User.findOne({_id: req.params.userId}, (err, user) => {
        if (err || !user) {
            errorHandler.sendErrorMessage(res, 404, defaultErrorMessage, []);
        } else {

            for (let i = 0; i < user.subscribingTopic.length; i++) {
                if (user.subscribingTopic[i]._publisherId == req.params.publisherId) {
                    user.subscribingTopic.splice(i, 1);

                    user.followingCount--;
                    if (user.followingCount < 0) user.followingCount = 0;

                    // Update user following promotion provider / promotion category
                    User.update({_id: user._id}, {
                        $set: {
                            subscribingTopic: user.subscribingTopic,
                            followingCount: user.followingCount
                        }
                    }, (err) => {
                        if (err) {
                            errorHandler.sendSystemError(res, err);
                        } else {
                            res.status(200).json({success: true, resultMessage: 'Bỏ theo dõi thành công!'});
                        }
                    });
                    return;
                }
            }

            errorHandler.sendErrorMessage(res, 400, 'Bạn đang không theo dõi nhà cung cấp/ thể loại khuyến mại này.', []);
        }
    });
};

/***
 * Update profile
 * @param req
 * @param res
 */
module.exports.updateProfile = (req, res) => {
    // Check request data
    if (!req.params.userId) {
        errorHandler.sendErrorMessage(res, 400, 'Bạn chưa điền đầy đủ thông tin', []);
        return;
    }

    // Update another user's profile
    if (req.authenticatedUser.userId != req.params.userId) {
        errorHandler.sendErrorMessage(res, 400, 'Bạn không thể cập nhật profile của người khác được', []);
        return;
    }

    req.body = removeNotAllowedInfoWhenUpdateProfile(req.body);
    User.findOneAndUpdate({_id: req.params.userId}, req.body, {new: true, runValidators: true}, (err, user) => {
        // Has an error when find user
        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        if (!user) {
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
        }
        else {
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                user: user.toJSON()
            });
        }
    });
};

/***
 * Pin a promotion
 * @param req
 * @param res
 */
module.exports.pinPromotion = (req, res) => {
    let userId = req.params.userId,
        promotionId = req.body._promotionId;

    if (!promotionId) {
        errorHandler.sendErrorMessage(res, 400, 'Thiếu ID chương trình khuyến mại', []);
        return;
    }

    User.findOne({_id: userId}, (err, user) => {
        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        // User not found
        if (!user) {
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
            return;
        }

        // Check pin promotion duplicate
        if (isPinned(promotionId, user.pinnedPromotion)) {
            errorHandler.sendErrorMessage(res, 400, 'Bạn đã ghim khuyến mãi này rồi', []);
            return;
        }

        // Pin promotion
        user.pinnedPromotion.push(promotionId);

        User.update({_id: user._id}, {
            $set: {
                pinnedPromotion: user.pinnedPromotion,
            }
        }, (err) => {
            if (err) {
                errorHandler.sendSystemError(res, err);
            } else {
                res.status(200).json({success: true, resultMessage: 'Ghim khuyến mãi thành công!'});
            }
        });
    });
};

/***
 * Unpin a promotion
 * @param req
 * @param res
 */
module.exports.unpinPromotion = (req, res) => {
    let userId = req.params.userId,
        promotionId = req.params.promotionId;

    if (!promotionId) {
        errorHandler.sendErrorMessage(res, 400, 'Thiếu ID chương trình khuyến mại', []);
        return;
    }

    User.findOne({_id: userId}, (err, user) => {
        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        // User not found
        if (!user) {
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
            return;
        }

        // Check unpin promotion not exist
        if (!isPinned(promotionId, user.pinnedPromotion)) {
            errorHandler.sendErrorMessage(res, 400, 'Bạn đang không ghim khuyến mãi này', []);
            return;
        }

        // Unpin promotion
        for (let i = 0; i < user.pinnedPromotion.length; i++) {
            if (user.pinnedPromotion[i] == promotionId) {
                user.pinnedPromotion.splice(i, 1);
                break;
            }
        }

        User.update({_id: user._id}, {
            $set: {
                pinnedPromotion: user.pinnedPromotion,
            }
        }, (err) => {
            if (err) {
                errorHandler.sendSystemError(res, err);
            } else {
                res.status(200).json({success: true, resultMessage: 'Bỏ ghim khuyến mãi thành công!'});
            }
        });
    });
};

/**
 * Get pinned promotion
 * @param req
 * @param res
 */
module.exports.getPinnedPromotion = (req, res) => {
    let userId = req.params.userId;
    User.findOne({_id: userId}, {'pinnedPromotion': {$slice: [(req.query.page - 1) * defaultPageSize, defaultPageSize]}})
        .populate('pinnedPromotion')
        .exec((err, user) => {
            if (err) {
                errorHandler.sendSystemError(res, err);
                return;
            }

            if (!user) {
                errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
                return;
            }

            User.populate(user.pinnedPromotion, {
                path: '_provider',
                select: 'avatar name address'
            }, (err, promotions) => {
                for (let i = 0; i < promotions.length; i++) {
                    promotions[i] = promotions[i].toObject();
                    promotions[i].isPinned = true;
                    promotions[i].isRegistered = utilCtrl.isInArray(user.registeredPromotion, promotions[i]._id);
                }

                //Arrange list promotions in endDate order
                promotions.sort(function (a, b) {
                    return (a.endDate < b.endDate) ? 1 : -1;
                });

                res.status(200).json({
                    success: true,
                    resultMessage: defaultSuccessMessage,
                    promotions: promotions
                });
            });
        });
};

module.exports.getAllProviders = (req, res) => {
    User.findOne({_id: req.authenticatedUser.userId}, (err, user) => {
        if (err) {
            errorCtrl.sendErrorMessage(res, 500,
                defaultErrorMessage,
                errorCtrl.getErrorMessage(err));
        }
        else if (!user)
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
        else {
            User.find({role: 'PROVIDER'})
                .skip((req.query.page - 1) * defaultPageSize).limit(defaultPageSize)
                .sort('name')
                .exec((err, users) => {
                    if (err)
                        errorHandler.sendSystemError(res, err);

                    else if (!users)
                        errorHandler.sendErrorMessage(res, 404, 'Không có dữ liệu', []);

                    else {
                        for (let i = 0; i < users.length; i++) {
                            users[i] = users[i].toObject();
                            users[i].isFollowing = false;

                            for (let j = 0; j < user.subscribingTopic.length; j++) {
                                if (user.subscribingTopic[j].subscribeType == "PROVIDER"
                                    && users[i]._id.equals(user.subscribingTopic[j]._publisherId)) {
                                    users[i].isFollowing = true;
                                    break;
                                }
                            }
                        }

                        res.status(200).json({
                            success: true,
                            resultMessage: defaultSuccessMessage,
                            users: users
                        });
                    }
                });
        }
    });
};

module.exports.searchProvider = (req, res) => {
    User.findOne({_id: req.authenticatedUser.userId}, (err, user) => {
        if (err) {
            errorCtrl.sendErrorMessage(res, 500,
                defaultErrorMessage,
                errorCtrl.getErrorMessage(err));
        }
        else if (!user)
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
        else {
            User.find({
                role: 'PROVIDER',
                nameNormalize: {$regex: utilCtrl.normalizeString(req.query.search)}
            })
                .skip((req.query.page - 1) * defaultPageSize).limit(defaultPageSize)
                .exec((err, users) => {
                    if (err)
                        errorHandler.sendErrorMessage(res, 500,
                            defaultErrorMessage,
                            errorHandler.getErrorMessage(err));

                    else if (!users)
                        errorHandler.sendErrorMessage(res, 404,
                            'Không có nhà cung cấp nào', []);

                    else {
                        for (let i = 0; i < users.length; i++) {
                            users[i] = users[i].toObject();
                            users[i].isFollowing = false;

                            for (let j = 0; j < user.subscribingTopic.length; j++) {
                                if (user.subscribingTopic[j].subscribeType == "PROVIDER"
                                    && users[i]._id.equals(user.subscribingTopic[j]._publisherId)) {
                                    users[i].isFollowing = true;
                                    break;
                                }
                            }
                        }

                        res.status(200).json({
                            success: true,
                            resultMessage: defaultSuccessMessage,
                            users: users
                        });
                    }
                })
        }
    });
};

module.exports.getVouchers = (req, res) => {
    Voucher.find({_user: req.params.userId})
        .populate({
            path: '_promotion',
            select: '_provider title commentCount addresses discountType discount endDate startDate condition cover',
            populate: {
                path: '_provider',
                select: 'name avatar address'
            }
        })
        .skip((req.query.page - 1) * defaultPageSize).limit(defaultPageSize)
        .exec((err, vouchers) => {
            if (err)
                errorHandler.sendErrorMessage(res, 500,
                    defaultErrorMessage,
                    errorHandler.getErrorMessage(err));
            else if (!vouchers)
                errorHandler.sendErrorMessage(res, 404,
                    'Bạn chưa đăng kí voucher nào!', []);
            else {
                //Arrange list vouchers in registeredDate order
                vouchers.sort(function (a, b) {
                    return (a.registeredDate < b.registeredDate) ? 1 : -1;
                });

                res.status(200).json({
                    success: true,
                    resultMessage: defaultSuccessMessage,
                    vouchers: vouchers
                });
            }
        });
};

/**
 * Sign out account
 */
module.exports.signOut = (req, res) => {

    User.findOneAndUpdate({_id: req.params.userId}, {$set: {accessToken: ''}}, {new: true}, (err, user) => {

        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        if (!user) {
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
        }
        else {
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                user: user.toJSON()
            });
        }
    });
};

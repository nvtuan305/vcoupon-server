'use strict';

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    authController = require('./authorization.controller.js'),
    errorHandler = require('./error.controller.js');

let User = mongoose.model('User'),
    Promotion = mongoose.model('Promotion');

let defaultErrorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!',
    defaultSuccessMessage = 'Thực hiện thành công',
    defaultPageSize = 15;

// Check user info is valid or invalid
function isValidUser(user) {
    // Wrong role
    if (!user.role || (user.role != 'NORMAL' && user.role != 'PROVIDER'))
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

// Save token and response user info
function responseUserInfo(res, user, token) {
    user.accessToken = token;

    User.update({_id: user._id}, user, {new: true}, function (err) {
        if (err) {
            errorHandler.sendErrorMessage(res, 422,
                defaultErrorMessage, errorHandler.getErrorMessage(err));
        } else {
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                user: user.toJSON()
            });
        }
    });
}

// Check promotion is pinned or not
function isPinned(promotionId, pinnedPromotion) {
    for (let i = 0; i < pinnedPromotion.length; i++) {
        if (pinnedPromotion[i]._id == promotionId)
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
    if (!req.body.phoneNumber || !req.body.password) {
        errorHandler.sendErrorMessage(res, 400,
            'Bạn chưa điền số điện thoại hoặc mật khẩu', []);
        return;
    }

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
            User.create(req.body, function (err, user) {
                if (err || !user) {
                    errorHandler.sendSystemError(res, err);
                }
                else {
                    let token = authController.getAccessToken(user._id, user.phoneNumber);
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
            if (err) {
                errorHandler.sendSystemError(res, err);
                return;
            }

            // Wrong email or password
            if (!user) {
                errorHandler.sendErrorMessage(res, 401,
                    'Số điện thoại này không tồn tại', []);
            }
            else {
                if (user.authenticate(req.body.password)) {
                    let token = authController.getAccessToken(user._id, user.phoneNumber);

                    if (token) {
                        responseUserInfo(res, user, token);
                    } else {
                        errorHandler.sendSystemError(res, err);
                    }
                } else {
                    errorHandler.sendErrorMessage(res, 401,
                        'Sai mật khẩu đăng nhập', []);
                }
            }
        });
};

/***
 * Sign in with Facebook
 * @param req
 * @param res
 */
module.exports.signInWithFacebook = (req, res) => {
    let providerId = req.body.providerId;
    let provider = req.body.provider;

    if (!provider || !providerId) {
        errorHandler.sendErrorMessage(res, 400, 'Thiếu thông tin đăng nhập', []);
        return;
    }

    User.findOne({provider: provider, providerId: providerId}, (err, user) => {
        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        if (!user) {
            errorHandler.sendErrorMessage(res, 401, 'Người dùng chưa đăng ký', []);
            return;
        }

        let token = authController.getAccessToken(user._id, user.phoneNumber);
        if (token) {
            responseUserInfo(res, user, token);
        } else {
            errorHandler.sendSystemError(res, err);
        }
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
            user.save((err) => {
                if (err) {
                    errorHandler.sendSystemError(res, err);
                } else {
                    res.status(200).json({success: true, resultMessage: 'Theo dõi thành công!'});
                }
            });
        }
    });
};

/**
 * Unfollow a promotion provider or promotion category
 * @param req
 * @param res
 */
module.exports.unfollowPromotionProvider = (req, res) => {
    // Check data request
    if (!req.params.userId || !req.body._publisherId) {
        errorHandler.sendErrorMessage(res, 404, 'Thiếu thông tin. Vui lòng kiểm tra lại', []);
        return;
    }

    if (req.params.userId == req.body._publisherId) {
        errorHandler.sendErrorMessage(res, 400, "Bạn không thể tự theo dõi mình được.", []);
        return;
    }

    User.findOne({_id: req.params.userId}, (err, user) => {
        if (err || !user) {
            errorHandler.sendErrorMessage(res, 404, defaultErrorMessage, []);
        } else {

            for (let i = 0; i < user.subscribingTopic.length; i++) {
                if (user.subscribingTopic[i]._publisherId == req.body._publisherId) {
                    user.subscribingTopic.splice(i, 1);

                    user.followingCount--;
                    if (user.followingCount < 0) user.followingCount = 0;

                    // Update user following promotion provider / promotion category
                    user.save((err) => {
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
    if (!req.body.phoneNumber || !req.params.userId) {
        errorHandler.sendErrorMessage(res, 400, 'Bạn chưa điền đầy đủ thông tin', []);
        return;
    }

    // Update another user's profile
    if (req.headers.user_id != req.params.userId) {
        errorHandler.sendErrorMessage(res, 400, 'Bạn không thể cập nhật profile của người khác được', []);
        return;
    }

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
        user.save((err) => {
            if (err) {
                errorHandler.sendSystemError(res, err);
            } else {
                res.status(200).json({
                    success: true,
                    resultMessage: 'Ghim khuyến mãi thành công'
                });
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

        // Check unpin promotion not exist
        if (!isPinned(promotionId, user.pinnedPromotion)) {
            errorHandler.sendErrorMessage(res, 400, 'Bạn đang không ghim khuyến mãi này', []);
            return;
        }

        // Unpin promotion
        for (let i = 0; i < user.pinnedPromotion.length; i++) {
            if (user.pinnedPromotion[i]._id == promotionId) {
                user.pinnedPromotion.splice(i, 1);
                break;
            }
        }

        user.save((err) => {
            if (err) {
                errorHandler.sendSystemError(res, err);
            } else {
                res.status(200).json({
                    success: true,
                    resultMessage: 'Bỏ ghim khuyến mãi thành công'
                });
            }
        });
    });
};

module.exports.getPinnedPromotion = (req, res) => {
    let userId = req.params.userId;
    let page = req.params.page;

    User.findOne({_id: userId}, (err, user) => {
        if (err) {
            errorHandler.sendSystemError(res, err);
            return;
        }

        if (!user) {
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
            return;
        }

        // Get promotion
        let pinnedPromotions = [];
        for (let i = 0; i < user.pinnedPromotion.length; i++) {
            Promotion.findOne({_id: user.pinnedPromotion[i]._promotionId}, (err, promotion) => {
                pinnedPromotions.push(promotion);
            });
        }
    });
};

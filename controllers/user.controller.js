'use strict';

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    authController = require('./authorization.controller.js'),
    errorCtrl = require('./response.controller.js');

let User = mongoose.model('User');

/**
 * Sign up new account
 * @param req: Request body
 * @param res: Response
 */
module.exports.signUp = function (req, res) {
    // Check request data
    if (!req.body.phoneNumber || !req.body.password) {
        errorCtrl.sendErrorMessage(res, 400,
            'Số điện thoại và mật khẩu là yêu cầu bắt buộc', []);
        return;
    }

    User.findOne({phoneNumber: req.body.phoneNumber},
        function (err, user) {
            // Has an error when find user
            if (err) {
                errorCtrl.sendErrorMessage(res, 500,
                    'Có lỗi xảy ra! Vui lòng thử lại',
                    errorCtrl.getErrorMessage(err));
            }

            // Existing the same user in database
            else if (user) {
                errorCtrl.sendErrorMessage(res, 409,
                    'Số điện thoại này đã được đăng ký. ' +
                    'Vui lòng đăng nhập hoặc tạo tài khoản bằng số điện thoại khác', []);
            }

            // Create new account
            else {
                User.create(req.body, function (err, user) {
                    if (err) {
                        errorCtrl.sendErrorMessage(res, 400,
                            'Đăng ký không thành công',
                            errorCtrl.getErrorMessage(err));
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
module.exports.signIn = function (req, res) {
    // Check request data
    if (!req.body.phoneNumber || !req.body.password) {
        errorCtrl.sendErrorMessage(res, 400,
            'Số điện thoại và mật khẩu là yêu cầu bắt buộc', []);
        return;
    }

    // Authenticate user
    User.findOne({phoneNumber: req.body.phoneNumber},
        function (err, user) {
            // Has an error when find user
            if (err) {
                errorCtrl.sendErrorMessage(res, 500,
                    'Có lỗi xảy ra! Vui lòng thử lại',
                    errorCtrl.getErrorMessage(err));
            }

            // Wrong email or password
            else if (!user) {
                errorCtrl.sendErrorMessage(res, 401,
                    'Sai số điện thoại đăng nhập', []);
            }

            else {
                if (user.authenticate(req.body.password)) {
                    let token = authController.getAccessToken(user._id, user.phoneNumber);

                    if (token) {
                        responseUserInfo(res, user, token);
                    } else {
                        errorCtrl.sendErrorMessage(res, 422,
                            'Có lỗi xảy ra! Vui lòng thử lại',
                            errorCtrl.getErrorMessage(err));
                    }
                } else {
                    errorCtrl.sendErrorMessage(res, 401,
                        'Sai mật khẩu đăng nhập', []);
                }
            }
        });
};

/**
 * Check user info is valid or invalid
 * @param user: user info
 * @returns {boolean} true - valid, false - invalid
 */
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
            errorCtrl.sendErrorMessage(res, 422,
                'Có lỗi xảy ra! Vui lòng thử lại',
                errorCtrl.getErrorMessage(err));
        } else {
            res.status(200).json({
                success: true,
                resultMessage: 'Thành công',
                user: user.toJSON()
            });
        }
    });
}

/***
 * Get user info
 * @param req
 * @param res
 */
module.exports.getUserInfo = (req, res) => {
    User.findOne({_id: req.params.userId}, function (err, user) {
        if (err || !user) {
            errorCtrl.sendErrorMessage(res, 404,
                'Người dùng này không tồn tại', []);
        }
        else {
            res.status(200).json({
                success: true,
                resultMessage: 'Thành công',
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
module.exports.followPromotion = (req, res) => {
    // Check data request
    if (!req.body._userId || !req.body._publisherId || !req.body.subscribeType) {
        errorCtrl.sendErrorMessage(res, 400, 'Thiếu thông tin. Vui lòng kiểm tra lại', []);
        return;
    }

    let subscribeInfo = {
        _publisherId: req.body._publisherId,
        subscribeType: req.body.subscribeType
    };

    User.findOne({_id: req.body._userId}, (err, user) => {
        if (err || !user) {
            errorCtrl.sendErrorMessage(res, 404, 'Có lỗi xảy ra. Vui lòng thử lại', []);
        } else {

            // Check duplicate following
            for (let i = 0; i < user.subscribingTopic.length; i++) {
                let provider = user.subscribingTopic[i];
                if (provider._publisherId == subscribeInfo._publisherId
                    && provider.subscribeType == subscribeInfo.subscribeType) {
                    errorCtrl.sendErrorMessage(res, 400, 'Bạn đã theo dõi nhà cung cấp/ thể loại khuyến mại này.', []);
                    return;
                }
            }

            // Update user following promotion provider / promotion category
            user.subscribingTopic.push(subscribeInfo);
            user.followingCount++;

            User.update({_id: req.body._userId}, {
                    $set: {
                        subscribingTopic: user.subscribingTopic,
                        followingCount: user.followingCount
                    }
                },
                {runValidators: true, override: true}, function (err) {
                    if (err) {
                        errorCtrl.sendErrorMessage(res, 404,
                            'Có lỗi xảy ra. Vui lòng thử lại',
                            errorCtrl.getErrorMessage(err));
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
module.exports.unfollowPromotion = function (req, res) {
    // Check data request
    if (!req.body._userId || !req.body._publisherId) {
        errorCtrl.sendErrorMessage(res, 404, 'Có lỗi xảy ra. Vui lòng thử lại', []);
        return;
    }

    User.findOne({_id: req.body._userId}, (err, user) => {
        if (err || !user) {
            errorCtrl.sendErrorMessage(res, 404, 'Có lỗi xảy ra. Vui lòng thử lại', []);
        } else {

            for (let i = 0; i < user.subscribingTopic.length; i++) {
                if (user.subscribingTopic[i]._publisherId == req.body._publisherId) {
                    user.subscribingTopic.splice(i, 1);

                    user.followingCount--;
                    if (user.followingCount < 0) user.followingCount = 0;

                    // Update user following promotion provider / promotion category
                    User.update({_id: req.body._userId}, {
                        $set: {subscribingTopic: user.subscribingTopic, followingCount: user.followingCount}
                    }, {runValidators: true, override: true}, function (err) {
                        if (err) {
                            errorCtrl.sendErrorMessage(res, 404,
                                'Có lỗi xảy ra. Vui lòng thử lại',
                                errorCtrl.getErrorMessage(err));
                        } else {
                            res.status(200).json({success: true, resultMessage: 'Bỏ theo dõi thành công!'});
                        }
                    });

                    return;
                }
            }

            errorCtrl.sendErrorMessage(res, 400, 'Bạn đang không theo dõi nhà cung cấp/ thể loại khuyến mại này.', []);
        }
    });
};

module.exports.updateProfile = (req, res) => {
    // Check request data
    if (!req.body.phoneNumber) {
        errorCtrl.sendErrorMessage(res, 400,
            'Phone number and password is required.');
        return;
    }

    User.findOne({phoneNumber: req.body.phoneNumber},
        function (err, user) {
            // Has an error when find user
            if (err) {
                errorCtrl.sendErrorMessage(res, 500,
                    'An error has occurred. Please try again.');
            }

            // Existing the same user in database
            else if (user) {
                errorCtrl.sendErrorMessage(res, 409,
                    'This user has already registered. Please sign in or create new account!');
            }

            // Create new account
            else {
                if (isValidUser(req.body)) {
                    User.create(req.body, function (err, user) {
                        if (err) {
                            errorCtrl.sendErrorMessage(res, 500,
                                'An error has occurred. Please try again. ' + err.message);
                        }
                        else {
                            var token = authController.getAccessToken(user._id, user.phoneNumber);
                            responseUserInfo(res, user, token);
                        }
                    });
                }

                // Invalid user
                else {
                    errorCtrl.sendErrorMessage(res, 400,
                        'User info is wrong. Please check it and try again!');
                }
            }
        });
};



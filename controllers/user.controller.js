/**
 * Created by apismantis on 04/12/2016.
 */

var mongoose = require('mongoose'),
    chalk = require('chalk'),
    tokenController = require('../controllers/token.controller'),
    errorCtrl = require('../controllers/error.controller');

var User = mongoose.model('User'),
    Token = mongoose.model('Token');

/**
 * Sign up new account
 * @param req: Request body
 * @param res: Response
 */
module.exports.signUp = function (req, res) {
    // Check request data
    if (!req.body.phoneNumber || !req.body.password) {
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
                            var token = tokenController.getAccessToken(user._id, user.phoneNumber);
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

/**
 * Sign in account
 * @param req: Request body
 * @param res
 */
module.exports.signIn = function (req, res) {
    // Check request data
    if (!req.body.phoneNumber || !req.body.password) {
        errorCtrl.sendErrorMessage(res, 400,
            'Please enter your phone number and password to login!');
        return;
    }

    var query = User.findOne({phoneNumber: req.body.phoneNumber});

    // Authenticate user
    User.findOne({phoneNumber: req.body.phoneNumber},
        function (err, user) {
            // Has an error when find user
            if (err) {
                errorCtrl.sendErrorMessage(res, 500,
                    'An error has occurred. Please try again! ' + err.message);
            }

            // Wrong email or password
            else if (!user) {
                errorCtrl.sendErrorMessage(res, 401,
                    'Wrong phone number!');
            }

            else {
                if (user.authenticate(req.body.password)) {
                    var token = tokenController.getAccessToken(user._id, user.phoneNumber);

                    if (token) {
                        responseUserInfo(res, user, token);
                    } else {
                        errorCtrl.sendErrorMessage(res, 401,
                            'Can not login. Please try again!');
                    }
                } else {
                    errorCtrl.sendErrorMessage(res, 401,
                        'Wrong password!');
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
            errorCtrl.sendErrorMessage(res, 500,
                'An error has occurred!');
        } else {
            res.status(200).json(user.toJSON());
        }
    });
}

/***
 * Get user info
 * @param req
 * @param res
 */
module.exports.getUserInfo = function (req, res) {
    User.findOne({_id: req.params.userId}, function (err, user) {
        if (err || !user) {
            res.status(404).json({success: false, message: 'User not found!'});
        }
        else {
            res.status(200).json(user.toJSONPublicProfile());
        }
    });
};

/**
 * Follow a promotion provider or promotion category
 * @param req
 * @param res
 */
module.exports.followPromotion = function (req, res) {
    // Check data request
    if (!req.body._userId || !req.body._publisherId || !req.body.subscribeType) {
        errorCtrl.sendErrorMessage(res, 400, 'Missing data.');
        return;
    }

    var subscribeInfo = {
        _publisherId: req.body._publisherId,
        subscribeType: req.body.subscribeType
    };

    User.findOne({_id: req.body._userId},
        function (err, user) {
            if (err || !user) {
                errorCtrl.sendErrorMessage(res, 404, 'An error has occurred. ' + err.message);
            } else {

                // Check duplicate following
                for (var i = 0; i < user.subscribingTopic.length; i++) {
                    var provider = user.subscribingTopic[i];
                    if (provider._publisherId == subscribeInfo._publisherId
                        && provider.subscribeType == subscribeInfo.subscribeType) {
                        errorCtrl.sendErrorMessage(res, 400, 'You have already followed it.');
                        return;
                    }
                }

                // Update user following promotion provider / promotion category
                user.subscribingTopic.push(subscribeInfo);
                User.update({_id: req.body._userId}, {$set: {subscribingTopic: user.subscribingTopic}},
                    {runValidators: true, override: true}, function (err) {
                        if (err) {
                            errorCtrl.sendErrorMessage(res, 404, 'An error has occurred. ' + err.message);
                        } else {
                            res.status(200).json({success: true, message: 'Followed successfully!'});
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
        errorCtrl.sendErrorMessage(res, 400, 'Missing data.');
        return;
    }

    User.findOne({_id: req.body._userId},
        function (err, user) {
            if (err || !user) {
                errorCtrl.sendErrorMessage(res, 404, 'An error has occurred. ' + err.message);
            } else {

                for (var i = 0; i < user.subscribingTopic.length; i++) {
                    if (user.subscribingTopic[i]._publisherId == req.body._publisherId) {
                        user.subscribingTopic.splice(i, 1);

                        // Update user following promotion provider / promotion category
                        User.update({_id: req.body._userId}, {$set: {subscribingTopic: user.subscribingTopic}},
                            {runValidators: true, override: true}, function (err) {
                                if (err) {
                                    errorCtrl.sendErrorMessage(res, 404, 'An error has occurred. ' + err.message);
                                } else {
                                    res.status(200).json({success: true, message: 'Unfollowed successfully!'});
                                }
                            });

                        return;
                    }
                }

                errorCtrl.sendErrorMessage(res, 404, 'You have not already followed it.');
            }
        });
};


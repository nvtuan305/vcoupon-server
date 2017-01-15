'use strict';

let mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    development = require('../config/development'),
    errorHandler = require('./error.controller.js');

let User = mongoose.model('User');

module.exports.getAccessToken = (user) => {
    let payload = {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role
    };

    // Generate new token for this user
    return jwt.sign(payload, development.token.secretKey, {expiresIn: '100d'});
};

/***
 * Authenticate user
 * @param req
 * @param res
 * @param next
 */
module.exports.authenticate = (req, res, next) => {
    let accessToken = req.headers.access_token || req.params.access_token || req.query.access_token || req.body.access_token;

    if (!accessToken) {
        errorHandler.sendErrorMessage(res, 401,
            'Thiếu thông tin xác thực người dùng', []);
        return;
    }

    jwt.verify(accessToken, development.token.secretKey, function (err, decoded) {
        // Authentication failed
        if (err) {
            errorHandler.sendErrorMessage(res, 401,
                'Access token hết hạn hoặc không chính xác!',
                errorHandler.getErrorMessage(err));
            return;
        }

        User.findOne({_id: decoded.id}, function (err, user) {
            if (err) {
                errorHandler.sendErrorMessage(res, 401,
                    'Không thể xác thực người dùng. Vui lòng thử lại!',
                    errorHandler.getErrorMessage(err));
                return;
            }

            if (user) {
                req.authenticatedUser = {
                    userId: user._id,
                    role: user.role
                };

                next();

            } else {
                errorHandler.sendErrorMessage(res, 401,
                    'Thông tin xác thực không chính xác', []);
            }
        });
    });
};

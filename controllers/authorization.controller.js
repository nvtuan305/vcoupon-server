'use strict';

let mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    development = require('../config/development'),
    responseCtrl = require('./response.controller.js');

let User = mongoose.model('User');

module.exports.getAccessToken = function (userId, phoneNumber) {
    // Generate new token for this user
    return jwt.sign({userId: userId, phoneNumber: phoneNumber}, development.token.secretKey, {expiresIn: '100d'});
};

module.exports.authenticate = function (req, res, next) {
    let userId = req.headers.user_id;
    let accessToken = req.headers.access_token;

    if (!accessToken || !userId) {
        responseCtrl.sendErrorMessage(res, 401,
            'Không thể xác thực người dùng. Thiếu thông tin xác thực', []);
    }

    // Authenticate token string
    else {
        try {
            // Decode token string
            let decoded = jwt.verify(accessToken, development.token.secretKey);

            // Find token in database
            User.findOne({_id: decoded.userId, accessToken: accessToken}, function (err, result) {
                if (err) {
                    responseCtrl.sendErrorMessage(res, 401,
                        'Không thể xác thực người dùng. Vui lòng thử lại!',
                        responseCtrl.getErrorMessage(err));
                } else {
                    if (result && result._id == userId) {
                        next();
                    } else {
                        responseCtrl.sendErrorMessage(res, 401,
                            'Thông tin xác thực không chính xác', []);
                    }
                }
            });

        } catch (err) {
            responseCtrl.sendErrorMessage(res, 401,
                'Access token hết hạn hoặc không chính xác!',
                responseCtrl.getErrorMessage(err));
        }
    }
};
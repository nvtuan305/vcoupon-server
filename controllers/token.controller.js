/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    development = require('../config/development'),
    errorCtrl = require('../controllers/error.controller');

var Token = mongoose.model('Token');

module.exports.getAccessToken = function (userId, phoneNumber) {
    // Generate new token for this user
    return jwt.sign({userId: userId, phoneNumber: phoneNumber}, development.token.secretKey, {expiresIn: '100d'});
};

module.exports.authenticate = function (req, res, next) {
    var userId = req.headers.userId || req.params.userId || req.body.userId;
    var token = req.headers.token || req.params.token || req.body.token;

    // Missing token string
    if (!token) {
        errorCtrl.sendErrorMessage(res, 401, 'Missing access token.');
    }

    // Missing user id
    else if (!userId) {
        errorCtrl.sendErrorMessage(res, 401, 'Missing user id.');
    }

    // Authenticate token string
    else {
        try {
            // Decode token string
            var decoded = jwt.verify(token, development.token.secretKey);

            // Find token in database
            User.findOne({_id: decoded.userId, accessToken: token}, function (err, result) {
                if (err) {
                    errorCtrl.sendErrorMessage(res, 401, 'Authenticate failed! Error: ' + err.message);
                } else {
                    if (result) {
                        next();
                    } else {
                        errorCtrl.sendErrorMessage(res, 401, 'Wrong token.');
                    }
                }
            });

        } catch (err) {
            errorCtrl.sendErrorMessage(res, 401, 'Authenticate failed! Error: ' + err.message);
        }
    }
};
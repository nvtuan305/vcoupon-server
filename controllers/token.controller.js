/**
 * Created by apismantis on 03/12/2016.
 */

var jwt = require('jsonwebtoken'),
    development = require('../config/development');

module.exports.getAccessToken = function (userId, phoneNumber) {
    return jwt.sign({userId: userId, phoneNumber: phoneNumber}, development.token.secretKey, {expiresIn: '100d'});
};

module.exports.authenticate = function (req, res, next) {
    var userId = req.header.userId || req.params.userId || req.body.userId;
    var token = req.header.token || req.params.token || req.body.token;

    if (!token) {
        res.status(401).json({success: false, message: "Missing access token."});
    }
    else if (!userId) {
        res.status(401).json({success: false, message: "Missing user id."});
    }
    else {
        try {
            var decoded = jwt.verify(token, development.token.secretKey);
            if (decoded.userId == userId) {
                next();
            }
            else {
                res.status(401).json({success: false, message: "Wrong token!"});
            }
        } catch (err) {
            res.status(401).json({success: false, message: 'Authenticate failed! Error: ' + err.message});
        }
    }
};
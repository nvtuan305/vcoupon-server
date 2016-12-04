/**
 * Created by apismantis on 03/12/2016.
 */

var jwt = require('jsonwebtoken'),
    config = require('../config/config');

module.exports.getAccessToken = function (userId, phoneNumber) {
    return jwt.sign({userId: userId, phoneNumber: phoneNumber}, config.secretKey, {expiresIn: '100d'});
};

module.exports.verifyAccessToken = function (userId, token) {
    try {
        var decoded = jwt.verify(token, config.secretKey);
        return decoded.userId == userId;

    } catch (err) {
        return false;
    }
};
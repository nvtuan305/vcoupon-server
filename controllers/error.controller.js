/**
 * Created by apismantis on 07/12/2016.
 */

module.exports.sendErrorMessage = function (res, statusCode, message) {
    res.status(statusCode).json({
        success: false,
        message: message
    });
};

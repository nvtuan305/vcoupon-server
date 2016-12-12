'use strict';

// Get error message from error object
module.exports.getErrorMessage = (error) => {
    let errorMessages = [];

    if (error.errors) {
        error.forEach((message) => {
            errorMessages.push(message);
        });
    } else {
        errorMessages.push(error.message);
    }

    return errorMessages;
};

/**
 * Response an error
 * @param res: Response object
 * @param statusCode: Status code
 * @param resultMessage: Result message
 * @param errors: List of error message
 */
module.exports.sendErrorMessage = (res, statusCode, resultMessage, errors) => {
    res.status(statusCode).json({
        success: false,
        resultMessage: resultMessage,
        errorMessage: errors
    });
};
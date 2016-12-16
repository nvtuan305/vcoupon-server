"use strict";

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    errorCtrl = require('./error.controller.js');

let Promotion = mongoose.model('Promotion');
let User = mongoose.model('User');

// Define default response message
let defaultErrorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!',
    defaultSuccessMessage = 'Thực hiện thành công';

module.exports.postNewPromotion = function (req, res) {
    if (!isValidPromotion(req.body)) {
        res.status(400).json({success: false, message: 'Please enter the full information!'});
    }
    else {
        User.findOne({_id: req.body._providerId},
            function (err, user) {
                // Has an error when find user
                if (err) {
                    errorCtrl.sendErrorMessage(res, 500,
                        'Có lỗi xảy ra! Vui lòng thử lại',
                        errorCtrl.getErrorMessage(err));
                }
                else {
                    Promotion.create(req.body, function (err) {
                        if (err) {
                            console.error(chalk.bgRed('Init promotion failed!'));
                            console.log(err);
                        } else {
                            console.info(chalk.blue('Init promotion successful!'));
                            user.promotionCount++;
                            console.log(user.promotionCount);
                            User.update({_id: req.body._providerId}, {
                                    $set: {
                                        promotionCount: user.promotionCount
                                    }
                                },
                                {runValidators: true, override: true}, function (err) {
                                    if (err) {
                                        errorCtrl.sendErrorMessage(res, 404,
                                            defaultErrorMessage,
                                            errorCtrl.getErrorMessage(err));
                                    } else {
                                        res.status(200).json({
                                            success: true,
                                            resultMessage: 'Post promotion thành công!'
                                        });
                                        res.send();
                                    }
                                });
                        }
                    });
                }
            });
    }
};

module.exports.getPromotionInfo = function (req, res) {
    Promotion.findOne({_id: req.params.promotionId}, function (err, promotion) {
        if (err || !promotion) {
            errorCtrl.sendErrorMessage(res, 404,
                'Promotion này không tồn tại', []);
        }
        else {
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                promotion: promotion.toJSON()
            });
        }
    });
};

function isValidPromotion(promotion) {
    let currentDate = new Date().getTime() / 1000;

    if (promotion._providerId == "" || promotion._providerId == null
        || promotion._categoryTypeID == "" || promotion._categoryTypeID == null
        || promotion.title == "" || promotion.title == null
        || promotion.amountLimit <= 0 || promotion.amountLimit == null
        || promotion.discount <= 0 || promotion.discount == null
        || promotion.endDate <= 0 || promotion.endDate == null
        || promotion.addresses == null || promotion.addresses.length == 0)
        return false;

    return promotion.endDate >= currentDate;
}

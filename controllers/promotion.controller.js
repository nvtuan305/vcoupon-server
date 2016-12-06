/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose'),
    chalk = require('chalk');

var Promotion = mongoose.model('Promotion');

module.exports.postNewPromotion = function (req, res) {
    if (!isValidPromotion(req.body)) {
        res.status(400).json({success: false, message: 'Please enter the full information!'});
    }
};

function isValidPromotion(promotion) {
    if (promotion.providerId == "" || promotion.providerId == null
        || promotion.categoryTypeID == "" || promotion.categoryTypeID == null
        || promotion.title == "" || promotion.title == null
        || promotion.amountLimit <= 0 || promotion.amountLimit == null
        || promotion.discount <= 0 || promotion.discount == null
        || promotion.endDate <= 0 || promotion.endDate == null
        || promotion.address.length == 0 || promotion.address == null)
        return false;

    var currentDate = new Date().getTime();
    return promotion.endDate >= currentDate;
}

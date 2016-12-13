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

module.exports.addPromotion = function (req, res) {
    // Insert some categories
    // Promotion.create(req.body, function (err) {
    //     if (err) {
    //         console.error(chalk.bgRed('Init promotion failed!'));
    //         console.log(err);
    //     } else {
    //         console.info(chalk.blue('Init promotion successful!'));
    //         res.send();
    //     }
    // });
};

module.exports.getPromotionInfo = function (req, res) {
    Promotion.findOne({_id: req.params._promotionId}, function (err, promotion) {
        if (err || !promotion) {
            res.status(404).json({success: false, message: 'Promotion not found!'});
        }
        else {
            res.status(200).json(promotion.toJSON());
        }
    });
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

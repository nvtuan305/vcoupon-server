'use strict';

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    errorCtrl = require('./error.controller'),
    utilCtrl = require('./util.controller');


let Category = mongoose.model('Category'),
    Promotion = mongoose.model('Promotion'),
    User = mongoose.model('User'),
    Voucher = mongoose.model('Voucher');

// Define default response message
let defaultErrorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!',
    defaultSuccessMessage = 'Thực hiện thành công';

module.exports.addSampleData = function (req, res) {
    let categories = [
        {
            name: 'Đồ ăn',
            cover: 'https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Fcover_category_food-min.jpg?alt=media&token=d01e01e0-c04d-404a-afe3-ea4e270b9e6d',
            type: 'FOOD'
        },
        {
            name: 'Quần áo',
            cover: 'https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Fcover_category_clothes-min.jpg?alt=media&token=00e40b0a-acce-41e9-96d3-e519227a5186',
            type: 'CLOTHES'
        },
        {
            name: 'Công nghệ',
            cover: 'https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Fcover_category_technology-min.jpg?alt=media&token=c21b2f3c-062e-45e7-9cfe-234f045a8624',
            type: 'TECH'
        }
    ];

    // Insert some categories
    Category.create(categories, function (err) {
        if (err) {
            console.error(chalk.bgRed('Init category failed!'));
            console.log(err);
        } else {
            console.info(chalk.blue('Init category successful!'));
            res.send();
        }
    });
};

//Get all promotions in category
module.exports.getAllPromotions = (req, res) => {
    let limit = 10;
    User.findOne({_id: req.authenticatedUser.userId}, (err, user) => {
        if (err) {
            errorCtrl.sendErrorMessage(res, 500,
                defaultErrorMessage,
                errorCtrl.getErrorMessage(err));
        }
        else if (!user)
            errorHandler.sendErrorMessage(res, 404, 'Người dùng không tồn tại', []);
        else {
            Promotion.find({_category: req.params.categoryId}).skip((req.query.page - 1) * limit).limit(limit)
                .populate('_provider', 'name avatar email phoneNumber address website fanpage rating').exec(function (err, promotions) {
                if (err || !promotions) {
                    errorCtrl.sendErrorMessage(res, 404,
                        'Không có Promotion nào', []);
                }
                else {
                    for (let i = 0; i < promotions.length; i++) {
                        promotions[i] = promotions[i].toObject();
                        promotions[i].isPinned = utilCtrl.isInArray(user.pinnedPromotion, promotions[i]._id);
                        promotions[i].isRegistered = utilCtrl.isInArray(user.registeredPromotion, promotions[i]._id);
                    }

                    //Arrange list promotions in endDate order
                    promotions.sort(function (a, b) {
                        return (a.endDate < b.endDate) ? 1 : -1;
                    });
                    res.status(200).json({
                        success: true,
                        resultMessage: defaultSuccessMessage,
                        promotions: promotions
                    });
                }
            })
        }
    });
};



module.exports.getAllCategories = (req, res) => {
    Category.find({}, (err, categories) => {
        if (err)
            errorHandler.sendSystemError(res, err);
        // Category not found
        else if (!categories)
            errorHandler.sendErrorMessage(res, 404, 'Không có thể loại nào', []);
        else {
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                categories: categories
            });
        }
    });
};

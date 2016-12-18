/**
 * Created by apismantis on 03/12/2016.
 */

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    errorCtrl = require('./error.controller');


let Category = mongoose.model('Category');
let Promotion = mongoose.model('Promotion');

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
    Promotion.find({_categoryTypeID: req.params.categoryId}).skip((req.query.page - 1) * limit).limit(limit).populate('_providerId').exec(function(err, promotions) {
        if (err || !promotions) {
            errorCtrl.sendErrorMessage(res, 404,
                'Không có Promotion nào', []);
        }
        else {
            //Arrange list promotions in createAt order
            promotions.sort(function (a, b) {
                return (a.createAt < b.createAt) ? -1 : 1;
            });
            res.status(200).json({
                success: true,
                resultMessage: defaultSuccessMessage,
                promotion: promotions
            });
        }
    })
};

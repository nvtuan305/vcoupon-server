/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose'),
    chalk = require('chalk');

var Category = mongoose.model('Category');

module.exports.addSampleData = function (req, res) {
    var categories = [
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

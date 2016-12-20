"use strict";

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    errorCtrl = require('./error.controller.js');

let Promotion = mongoose.model('Promotion');
let User = mongoose.model('User');
let Comment = mongoose.model('Comment');

// Define default response message
let defaultErrorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!',
    defaultSuccessMessage = 'Thực hiện thành công',
    commentLimit = 15;

module.exports.postNewPromotion = function (req, res) {
    if (!isValidPromotion(req.body)) {
        res.status(400).json({success: false, message: 'Please enter the full information!'});
    }
    else {
        User.findOne({_id: req.body._provider},
            function (err, user) {
                // Has an error when find user
                if (err) {
                    errorCtrl.sendErrorMessage(res, 500,
                        defaultErrorMessage,
                        errorCtrl.getErrorMessage(err));
                }
                else {
                    Promotion.create(removeRedundant(req.body), function (err) {
                        if (err) {
                            console.error(chalk.bgRed('Init promotion failed!'));
                            console.log(err);
                        } else {
                            console.info(chalk.blue('Init promotion successful!'));
                            user.promotionCount++;
                            User.update({_id: req.body._provider}, {
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

module.exports.postNewComment = (req, res) => {
    if (!isValidComment(req.body)) {
        res.status(400).json({success: false, message: 'Please enter the full information!'});
    }
    else {
        Promotion.findOne({_id: req.params.promotionId}, function (err, promotion) {
            // Has an error when find promotion
            if (err) {
                errorCtrl.sendErrorMessage(res, 500,
                    defaultErrorMessage,
                    errorCtrl.getErrorMessage(err));
            }
            else {
                Comment.create(req.body, function (err) {
                    if (err) {
                        console.error(chalk.bgRed('Init comment failed!'));
                        console.log(err);
                    } else {
                        console.info(chalk.blue('Init comment successful!'));
                        promotion.commentCount++;
                        promotion.save(function (err) {
                            if (err) {
                                errorCtrl.sendErrorMessage(res, 404,
                                    defaultErrorMessage,
                                    errorCtrl.getErrorMessage(err));
                            } else {
                                res.status(200).json({
                                    success: true,
                                    resultMessage: defaultSuccessMessage,
                                });
                            }
                        });
                    }
                });
            }
        })
    }
};

function isValidComment(comment) {
    if (comment._user == "" || comment._user == null
        || comment._promotion == "" || comment._promotion == null
        || comment.message == "" || comment.message == null)
        return false;

    return true;
}

module.exports.getAllComments = (req, res) => {
    Promotion.findOne({_id: req.params.promotionId}, function (err, promotion) {
        if (err || !promotion) {
            errorCtrl.sendErrorMessage(res, 404,
                'Khuyến mãi này không tồn tại', []);
        }
        else {
            Comment.find({_promotion: req.params.promotionId}).skip((req.query.page - 1) * commentLimit).limit(commentLimit)
                .populate('_user', ' avatar name').exec(function (err, comments) {
                if (err || !comments) {
                    errorCtrl.sendErrorMessage(res, 404,
                        'Không có bình luận nào', []);
                }
                else {
                    //Arrange list promotion in createdAt order
                    comments.sort(function (a, b) {
                        return (a.createdAt < b.createdAt) ? -1 : 1;
                    });
                    res.status(200).json({
                        success: true,
                        resultMessage: defaultSuccessMessage,
                        comments: comments
                    });
                }
            });
        }
    });

};

function isValidPromotion(promotion) {
    if (promotion._provider == "" || promotion._provider == null
        || promotion._category == "" || promotion._category == null
        || promotion.title == "" || promotion.title == null
        || promotion.amountLimit <= 0 || promotion.amountLimit == null
        || promotion.discount <= 0 || promotion.discount == null
        || promotion.endDate <= 0 || promotion.endDate == null
        || promotion.addresses == null || promotion.addresses.length == 0)
        return false;
    let currentDate = new Date().getTime() / 1000;
    return promotion.endDate >= currentDate;
}

function removeRedundant(promotion) {
    delete promotion.commentCount;
    delete promotion.pinnedCount;
    delete promotion.amountRegistered;
    return promotion;
}
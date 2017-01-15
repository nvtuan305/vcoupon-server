"use strict";

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    errorCtrl = require('./error.controller'),
    utilCtrl = require('./util.controller');

let Promotion = mongoose.model('Promotion'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment'),
    Voucher = mongoose.model('Voucher');

// Define default response message
let defaultErrorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!',
    defaultSuccessMessage = 'Thực hiện thành công',
    commentLimit = 15,
    promotionLimit = 15,
    distanceLimit = 5000; //Tối đa 5km

module.exports.postNewPromotion = function (req, res) {
    if (req.authenticatedUser.role != "PROVIDER") {
        errorCtrl.sendErrorMessage(res, 405, 'Chức năng này chỉ dùng cho nhà cung cấp chương trình khuyến mãi!', []);
        return;
    }

    if (!isValidPromotion(req.body)) {
        errorCtrl.sendErrorMessage(res, 400, 'Bạn chưa điền đầy đủ thông tin', []);
        return;
    }

    let currentDate = new Date().getTime();
    if (currentDate > req.body.endDate * 1000) {
        errorCtrl.sendErrorMessage(res, 400, 'Khuyến mãi này có ngày hết hạn đang nhỏ hơn ngày hiện tại', []);
        return;
    }

    User.findOne({_id: req.body._provider}, (err, user) => {
        if (err || !user) {
            errorCtrl.sendErrorMessage(res, 500, 'Nhà cung cấp khuyến mãi không tồn tại', errorCtrl.getErrorMessage(err));
            return;
        }

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
                                resultMessage: 'Đăng tải chương trình khuyến mãi thành công!'
                            });
                            res.send();
                        }
                    });
            }
        });

    });
};

module.exports.getPromotionInfo = function (req, res) {
    Promotion.findOne({_id: req.params.promotionId}, function (err, promotion) {
        if (err || !promotion) {
            errorCtrl.sendErrorMessage(res, 404,
                'Chương trình khuyến mãi này không tồn tại', []);
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
        errorCtrl.sendErrorMessage(res, 400, 'Please enter the full information!', []);
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
                Comment.create({
                    _promotion: req.params.promotionId,
                    _user: req.body._user,
                    message: req.body.message
                }, function (err) {
                    if (err) {
                        console.error(chalk.bgRed('Init comment failed!'));
                        console.log(err);
                    } else {
                        console.info(chalk.blue('Init comment successful!'));
                        promotion.commentCount++;
                        Promotion.update({_id: promotion._id}, {
                            $set: {
                                commentCount: promotion.commentCount
                            }
                        }, (err) => {
                            if (err) {
                                errorCtrl.sendErrorMessage(res, 500,
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
        || comment.message == "" || comment.message == null)
        return false;

    return true;
}

module.exports.getAllComments = (req, res) => {
    Promotion.findOne({_id: req.params.promotionId}, function (err, promotion) {
        if (err || !promotion) {
            errorCtrl.sendErrorMessage(res, 404,
                'Chương trình khuyến mãi này không tồn tại', []);
        }
        else {
            Comment.find({_promotion: req.params.promotionId}).skip((req.query.page - 1) * commentLimit).limit(commentLimit)
                .populate('_user', ' avatar name').exec(function (err, comments) {
                if (err) {
                    errorCtrl.sendErrorMessage(res, 500,
                        defaultErrorMessage, []);
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

module.exports.getAllPromotion = (req, res) => {
    Promotion.find({})
        .skip((req.query.page - 1) * promotionLimit).limit(promotionLimit)
        .populate('_provider', 'name avatar address')
        .exec((err, promotions) => {
            if (err)
                errorCtrl.sendErrorMessage(res, 500,
                    defaultErrorMessage,
                    errorCtrl.getErrorMessage(err));

            else if (!promotions)
                errorCtrl.sendErrorMessage(res, 404,
                    'Không có chương trình khuyến mại nào', []);

            else {
                res.status(200).json({
                    success: true,
                    resultMessage: defaultSuccessMessage,
                    promotions: promotions
                });
            }
        })
};

module.exports.searchPromotion = (req, res) => {
    Promotion.find({title: {$regex: req.query.search}})
        .skip((req.query.page - 1) * promotionLimit).limit(promotionLimit)
        .populate('_provider', 'name avatar address')
        .exec((err, promotions) => {
            if (err)
                errorCtrl.sendErrorMessage(res, 500,
                    defaultErrorMessage,
                    errorCtrl.getErrorMessage(err));

            else if (!promotions)
                errorCtrl.sendErrorMessage(res, 404,
                    'Không có chương trình khuyến mại nào', []);

            else {
                res.status(200).json({
                    success: true,
                    resultMessage: defaultSuccessMessage,
                    promotions: promotions
                });
            }
        })
};

module.exports.getNearPromotion = (req, res) => {
    Promotion.find({}).elemMatch('addresses', {
        "province": req.body.province,
        "country": req.body.country
    }).exec((err, promotions) => {
        if (err)
            errorCtrl.sendErrorMessage(res, 500,
                defaultErrorMessage,
                errorCtrl.getErrorMessage(err));

        else if (!promotions || promotions.length == 0)
            errorCtrl.sendErrorMessage(res, 404,
                'Không có chương trình khuyến mại nào trong tỉnh/thành phô này', []);
        else {
            let listNearPromotions = new Array();
            for (let i = 0; i < promotions.length; i++) {
                let newPromotion = JSON.parse(JSON.stringify(promotions[i]));
                newPromotion.addresses = new Array();
                //Xét các địa chỉ trong 1 promotion
                for (let j = 0; j < promotions[i].addresses.length; j++) {
                    let longPromotion = promotions[i].addresses[j].longitude;
                    let latPromotion = promotions[i].addresses[j].latitude;
                    let longUser = req.body.longitude;
                    let latUser = req.body.latitude;
                    //Xét khoảng cách của địa điểm đó
                    if (utilCtrl.getDistance(longPromotion, latPromotion, longUser, latUser) <= distanceLimit) {
                        newPromotion.addresses.push(promotions[i].addresses[j]);
                    }
                }

                //Hủy promotion nếu không có địa điểm nào gần user
                if (newPromotion.addresses.length > 0) {
                    listNearPromotions.push(newPromotion);
                }
            }

            if (listNearPromotions.length == 0) {
                errorCtrl.sendErrorMessage(res, 404,
                    'Không có chương trình khuyến mại nào trong bán kính 5km', []);
            }
            else {
                res.status(200).json({
                    success: true,
                    resultMessage: defaultSuccessMessage,
                    promotions: listNearPromotions
                });
            }

        }
    });
};

module.exports.createVoucher = (req, res) => {
    Promotion.findOne({_id: req.params.promotionId}, (err, promotion) => {
        if (err) {
            errorCtrl.sendErrorMessage(res, 500,
                defaultErrorMessage,
                errorCtrl.getErrorMessage(err));
        }
        else if (!promotion) {
            errorCtrl.sendErrorMessage(res, 404,
                'Chương trình khuyến mãi này không tồn tại', []);
        }
        else if (parseInt(new Date().getTime() / 1000) > promotion.endDate) {
            errorCtrl.sendErrorMessage(res, 410,
                'Chương trình khuyến mãi này đã hết hạn', []);
        }
        else if (promotion.amountRegistered >= promotion.amountLimit) {
            errorCtrl.sendErrorMessage(res, 416,
                'Đã hết số lượng mã', []);
        }
        else if (promotion._provider == req.headers.user_id) {
            errorCtrl.sendErrorMessage(res, 416,
                'Bạn không thể nhận mã voucher trong chương trình khuyến mãi của bạn', []);
        }
        else {
            //Xét đã đăng kí voucher chưa
            Voucher.findOne({
                _promotion: promotion._id,
                _user: req.headers.user_id
            }, (err, voucher) => {
                if (err)
                    errorCtrl.sendErrorMessage(res, 500,
                        defaultErrorMessage,
                        errorCtrl.getErrorMessage(err));
                else if (voucher)
                    res.status(200).json({
                        success: true,
                        resultMessage: 'Bạn đã đăng kí chương trình khuyến mãi này rồi!',
                        voucher: voucher
                    });
                else {
                    // Nếu promotion sử dụng mã chung cho tất cả voucher
                    if (promotion.isOneCode == true) {
                        Voucher.create({
                            _user: req.headers.user_id,
                            _promotion: promotion._id,
                            voucherCode: promotion.voucherCode,
                            qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + promotion.voucherCode
                        }, (err, voucher) => {
                            if (err)
                                errorCtrl.sendErrorMessage(res, 500,
                                    defaultErrorMessage,
                                    errorCtrl.getErrorMessage(err));
                            else {
                                promotion.amountRegistered++;
                                Promotion.update({_id: promotion._id}, {
                                    $set: {
                                        amountRegistered: promotion.amountRegistered
                                    }
                                }, (err) => {
                                    if (err) {
                                        errorCtrl.sendErrorMessage(res, 500,
                                            defaultErrorMessage,
                                            errorCtrl.getErrorMessage(err));
                                    } else {
                                        res.status(200).json({
                                            success: true,
                                            resultMessage: defaultSuccessMessage,
                                            voucher: voucher
                                        });
                                    }
                                });
                            }
                        });
                    }
                    // Nếu promotion sử dụng mã code riêng cho từng voucher
                    else {
                        Voucher.find({_promotion: promotion._id}, (err, vouchers) => {
                            if (err) {
                                errorCtrl.sendErrorMessage(res, 500,
                                    defaultErrorMessage,
                                    errorCtrl.getErrorMessage(err));
                                return;
                            }

                            let isUsageCode = false;
                            let key;

                            while (isUsageCode == false) {
                                isUsageCode = true;
                                key = utilCtrl.generateCode();
                                for (let i = 0; i < vouchers.length; i++) {
                                    if (vouchers[i].voucherCode == key) {
                                        isUsageCode = false;
                                        break;
                                    }
                                }
                            }

                            Voucher.create({
                                _user: req.headers.user_id,
                                _promotion: promotion._id,
                                voucherCode: key,
                                qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + key
                            }, (err, voucher) => {
                                if (err)
                                    errorCtrl.sendErrorMessage(res, 500,
                                        defaultErrorMessage,
                                        errorCtrl.getErrorMessage(err));
                                else {
                                    promotion.amountRegistered++;
                                    Promotion.update({_id: promotion._id}, {
                                        $set: {
                                            amountRegistered: promotion.amountRegistered
                                        }
                                    }, (err) => {
                                        if (err) {
                                            errorCtrl.sendErrorMessage(res, 500,
                                                defaultErrorMessage,
                                                errorCtrl.getErrorMessage(err));
                                        } else {
                                            res.status(200).json({
                                                success: true,
                                                resultMessage: defaultSuccessMessage,
                                                voucher: voucher
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
            });
        }
    })
};



module.exports.getAllVouchers = (req, res) => {
    Promotion.findOne({_id: req.params.promotionId}, (err, promotion) => {
        if (err)
            errorCtrl.sendErrorMessage(res, 500,
                defaultErrorMessage,
                errorCtrl.getErrorMessage(err));
        else if (!promotion)
            errorCtrl.sendErrorMessage(res, 404,
                'Chương trình khuyến mãi này không tồn tại', []);
        else if (promotion._provider != req.headers.user_id)
            errorCtrl.sendErrorMessage(res, 410,
                'Chương trình khuyến mãi này không phải của bạn', []);
        else {
            Voucher.find({_promotion: promotion._id})
                .skip((req.query.page - 1) * voucherLimit).limit(voucherLimit)
                .populate('_user', 'name avatar gender')
                .exec((err, vouchers) => {
                    if (err) {
                        errorCtrl.sendErrorMessage(res, 500,
                            defaultErrorMessage,
                            errorCtrl.getErrorMessage(err));
                    }
                    else if (!vouchers) {
                        errorCtrl.sendErrorMessage(res, 404,
                            'Chưa có voucher nào', []);
                    }
                    else {
                        res.status(200).json({
                            success: true,
                            resultMessage: defaultSuccessMessage,
                            vouchers: vouchers
                        });
                    }
                })
        }
    });
};

module.exports.checkVoucher = (req, res) => {
    Promotion.findOne({_id: req.params.promotionId}, (err, promotion) => {
        if (err)
            errorCtrl.sendErrorMessage(res, 500,
                defaultErrorMessage,
                errorCtrl.getErrorMessage(err));
        else if (!promotion)
            errorCtrl.sendErrorMessage(res, 404,
                'Chương trình khuyến mãi này không tồn tại', []);
        else if (promotion._provider != req.headers.user_id)
            errorCtrl.sendErrorMessage(res, 410,
                'Chương trình khuyến mãi này không phải của bạn', []);
        else {
            Voucher.findOne({
                _promotion: promotion._id,
                voucherCode: req.body.voucherCode
            }).exec((err, voucher) => {
                if (err) {
                    errorCtrl.sendErrorMessage(res, 500,
                        defaultErrorMessage,
                        errorCtrl.getErrorMessage(err));
                }
                else if (!voucher) {
                    errorCtrl.sendErrorMessage(res, 404,
                        'Mã này chưa được đăng kí', []);
                }
                else if (voucher.isChecked == true) {
                    errorCtrl.sendErrorMessage(res, 416,
                        'Mã này đã được sử dụng rồi', []);
                }
                else {
                    voucher.isChecked = true;
                    Voucher.update({_id: voucher._id}, {
                        $set: {
                            isChecked: voucher.isChecked
                        }
                    }, (err) => {
                        if (err)
                            errorCtrl.sendErrorMessage(res, 500,
                                defaultErrorMessage,
                                errorCtrl.getErrorMessage(err));
                        else
                            res.status(200).json({
                                success: true,
                                resultMessage: defaultSuccessMessage,
                            });
                    });
                }
            })
        }
    })
};

function isValidPromotion(promotion) {
    if (!promotion._provider
        || !promotion._category
        || !promotion.title
        || !promotion.amountLimit
        || !promotion.discount
        || !promotion.endDate || promotion.endDate <= 0
        || !promotion.addresses || promotion.addresses.length == 0)
        return false;

    return true;
}

function removeRedundant(promotion) {
    delete promotion.commentCount;
    delete promotion.pinnedCount;
    delete promotion.amountRegistered;
    delete promotion.voucherCode;
    return promotion;
}
var express = require('express'),
    router = express.Router();

var promotionController = require('../controllers/promotion.controller'),
    authController = require('../controllers/authorization.controller.js');


router
    .post('/', function (req, res, next) {
        authController.authenticate(req, res, next);
    }, (req, res) => {
       promotionController.postNewPromotion(req, res);
    })

    .get('/:promotionId', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
       promotionController.getPromotionInfo(req, res);
    })

    .post('/:promotionId/comments', (req, res, next) => {
       authController.authenticate(req, res, next);
    }, (req, res) => {
        promotionController.postNewComment(req, res);
    })

    .get('/:promotionId/comments', (req, res) => {
        promotionController.getAllComments(req, res);
    })

    .get('/', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        if (req.query.search == undefined || req.query.search == "")
            promotionController.getAllPromotion(req, res);
        else
            promotionController.searchPromotion(req, res);
    })

    .post('/:promotionId/vouchers', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        promotionController.createVoucher(req, res);
    })

    .get('/:promotionId/vouchers', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        promotionController.getAllVouchers(req, res);
    })

    .post('/:promotionId/vouchers/check-voucher', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        promotionController.checkVoucher(req, res);
    })

    .post('/near-promotion', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        promotionController.getNearPromotion(req, res);
    });

module.exports = router;
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

    .get('/:promotionId', (req, res) => {
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

    .get('/', (req, res) => {
       promotionController.searchPromotion(req, res);
    });
    //
    // .post('/:promotionId/create-voucher', (req, res, next) => {
    //     authController.authenticate(req, res, next);
    // }, (req, res) => {
    //     promotionController.createVoucher(req, res);
    // });

module.exports = router;
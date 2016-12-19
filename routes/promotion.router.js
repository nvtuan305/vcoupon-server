var express = require('express'),
    router = express.Router();

var promotionController = require('../controllers/promotion.controller'),
    authController = require('../controllers/authorization.controller.js');


router
    .post('/', function (req, res, next) {
        authController.authenticate(req, res, next);
    }, function (req, res, next) {
        // add promotion here
       promotionController.postNewPromotion(req, res);
    })

    .get('/:promotionId', function (req, res) {
       promotionController.getPromotionInfo(req, res);
    })

    .post('/:promotionId/comments', function (req, res, next) {
       authController.authenticate(req, res, next);
    }, function (req, res) {
        promotionController.postNewComment(req, res);
    });

module.exports = router;
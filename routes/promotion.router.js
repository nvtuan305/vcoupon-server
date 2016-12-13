var express = require('express'),
    router = express.Router();

var promotionController = require('../controllers/promotion.controller');

router
    .post('/post-promotion', function (req, res, next) {
        tokenController.authenticate(req, res, next);
    }, function (req, res, next) {
        // add promotion here
    })

    .get('/:promotionId', function (req, res) {

    });

module.exports = router;
var express = require('express'),
    router = express.Router();

var promotionController = require('../controllers/promotion.controller'),
    authController = require('../controllers/authorization.controller.js');

router.post('/post-promotion', function (req, res, next) {
    authController.authenticate(req, res, next);
}, function (req, res, next) {
    // add promotion here
});

module.exports = router;
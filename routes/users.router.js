var express = require('express'),
    router = express.Router();

var userController = require('../controllers/user.controller');

router
// Sign up new account
    .post('/sign-up', function (req, res) {
        userController.signUp(req, res);
    })

    // Sign in account
    .post('/sign-in', function (req, res) {
        userController.signIn(req, res);
    })

    // Get user info
    .get('/:userId', function (req, res) {
        userController.getUserInfo(req, res);
    })

    // Follow an promotion provider or promotion category
    .post('/follow-promotion/', function (req, res) {
        userController.followPromotion(req, res);
    })

    // Unfollow an promotion provider or promotion category
    .post('/unfollow-promotion/', function (req, res) {
        userController.unfollowPromotion(req, res);
    });

module.exports = router;

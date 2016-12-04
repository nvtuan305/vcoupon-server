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
        console.log('Get user info: ' + req.params.userId);
        userController.getUserInfo(req, res);
    });

module.exports = router;

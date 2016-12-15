'use strict';

let express = require('express'),
    router = express.Router();

let userController = require('../controllers/user.controller'),
    authController = require('../controllers/authorization.controller');

router
// Sign up new account
    .post('/sign-up', (req, res) => {
        userController.signUp(req, res);
    })

    // Sign in account
    .post('/sign-in', (req, res) => {
        userController.signIn(req, res);
    })

    // Sign in with facebook
    .post('/sign-in-facebook', (req, res) => {
        userController.signInWithFacebook(req, res);
    })

    // Get user info
    .get('/:userId', (req, res) => {
        userController.getUserInfo(req, res);
    })

    // Follow an promotion provider or promotion category
    .post('/follow-promotion/', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.followPromotion(req, res);
    })

    // Unfollow an promotion provider or promotion category
    .post('/unfollow-promotion/', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.unfollowPromotion(req, res);
    });

module.exports = router;

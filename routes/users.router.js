'use strict';

let express = require('express'),
    router = express.Router();

let userController = require('../controllers/user.controller'),
    authController = require('../controllers/authorization.controller');

router
// Sign up new account
    .post('/', (req, res) => {
        userController.signUp(req, res);
    })

    .get('/providers', (req, res) => {
        userController.getAllProviders(req, res);
    })

    // Update profile
    .put('/:userId', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.updateProfile(req, res);
    })

    // Get user info
    .get('/:userId', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.getUserInfo(req, res);
    })

    // Sign in account
    .post('/sign-in', (req, res) => {
        userController.signIn(req, res);
    })

    // Sign in with facebook
    .post('/sign-in-facebook', (req, res) => {
        userController.signInWithFacebook(req, res);
    })

    // Follow an promotion provider or promotion category
    .post('/:userId/follows', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.followPromotionProvider(req, res);
    })

    // Unfollow an promotion provider or promotion category
    .delete('/:userId/follows/:publisherId', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.unfollowPromotionProvider(req, res);
    })

    // Get pinned promotion
    .get('/:userId/pinned-promotion', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.getPinnedPromotion(req, res);
    })

    // Pin promotion
    .post('/:userId/pinned-promotion', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.pinPromotion(req, res);
    })

    // Unpin promotion
    .delete('/:userId/pinned-promotion/:promotionId', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.unpinPromotion(req, res);
    });

module.exports = router;

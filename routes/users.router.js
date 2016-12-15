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

    // Follow an promotion provider or promotion category
    .post('/follow', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.followPromotion(req, res);
    })

    // Unfollow an promotion provider or promotion category
    .post('/unfollow', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        userController.unfollowPromotion(req, res);
    });

module.exports = router;

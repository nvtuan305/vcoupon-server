/**
 * Created by apismantis on 03/12/2016.
 */

let express = require('express'),
    router = express.Router(),
    categoryController = require('../controllers/category.controller'),
    authController = require('../controllers/authorization.controller');

router
    .post('/add-sample-data', (req, res) => {
        console.log('Adding sample data...');
        categoryController.addSampleData(req, res);
    })

    .get('/:categoryId/promotions', (req, res, next) => {
        authController.authenticate(req, res, next);
    }, (req, res) => {
        categoryController.getAllPromotions(req, res);
    })

    .get('/', (req, res) => {
       categoryController.getAllCategories(req, res);
    });
module.exports = router;

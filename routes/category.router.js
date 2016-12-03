/**
 * Created by apismantis on 03/12/2016.
 */

var express = require('express'),
    router = express.Router(),
    categoryController = require('../controllers/category.controller');

router
    .post('/add-sample-data', function (req, res) {
        console.log('Adding sample data...');
        categoryController.addSampleData(req, res);
    });

module.exports = router;

/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose'),
    config = require('../config/app');

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required.']
    },

    cover: {
        type: String,
        default: config.category.defaultCover
    },

    type: {
        type: String,
        unique: true,
        default: config.category.defaultType
    }
});

mongoose.model('Category', categorySchema);
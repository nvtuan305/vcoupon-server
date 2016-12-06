/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose'),
    config = require('../config/app');

var ObjectId = mongoose.Schema.ObjectId;

var promotionSchema = new mongoose.Schema({
    _providerId: {
        type: ObjectId,
        ref: 'User'
    },

    _categoryTypeID: {
        type: ObjectId,
        ref: 'Category'
    },

    title: String,

    cover: {
        type: String,
        default: config.promotion.defaultCover
    },

    condition: {
        type: String,
        default: config.promotion.defaultCondition
    },

    startDate: {
        type: Number,
        default: 0
    },

    endDate: {
        type: Number,
        default: 0
    },

    amountLimit: {
        type: Number,
        default: 0
    },

    amountRegistered: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    discountType: {
        type: String,
        default: '%' // % or VND
    },

    addresses: [String],

    pinnedCount: {
        type: Number,
        default: 0
    },

    commentCount: {
        type: Number,
        default: 0
    }

});

mongoose.model('Promotion', promotionSchema);

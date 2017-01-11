/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose'),
    config = require('../config/app');

var ObjectId = mongoose.Schema.ObjectId;

var promotionSchema = new mongoose.Schema({
    _provider: {
        type: ObjectId,
        ref: 'User'
    },

    _category: {
        type: ObjectId,
        ref: 'Category'
    },

    title: {
        type: String,
    },

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

    addresses: [
        {
            number: String,
            street: String,
            ward: String,
            district: String,
            province: String,
            latitude: Number,
            country: {
                type: String,
                default: "Việt Nam"
            },
            longitude: Number
        }
    ],

    pinnedCount: {
        type: Number,
        default: 0
    },

    commentCount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Number,
        default: getCurrentDate()
    }
});

// Transform promotion to JSON
promotionSchema.methods.toJSON = function () {
    var promotion = this.toObject();
    return promotion;
};

promotionSchema.pre('save', function (next) {
    this.createdAt = getCurrentDate();
    next();
});

function getCurrentDate() {
    return parseInt(new Date().getTime() / 1000);
}

mongoose.model('Promotion', promotionSchema);

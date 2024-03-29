/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose'),
    config = require('../config/app'),
    utilCtrl = require('../controllers/util.controller');

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

    title: String,

    titleNormalize: {
        type: String,
        default: this.title
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
            province: {
                type: String,
                default: "Thành phố Hồ Chí Minh"
            },
            provinceNormalize: {
                type: String,
                default: this.province
            },
            latitude: Number,
            country: {
                type: String,
                default: "Việt Nam"
            },
            countryNormalize: {
                type: String,
                default: this.country
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
        default: utilCtrl.getCurrentDate()
    },

    isOneCode: Boolean,

    voucherCode: String,
});

// Transform promotion to JSON
promotionSchema.methods.toJSON = function () {
    var promotion = this.toObject();
    delete promotion.titleNormalize;
    return promotion;
};

promotionSchema.pre('save', function (next) {
    this.titleNormalize = utilCtrl.normalizeString(this.title);
    for (let i = 0; i < this.addresses.length; i++)
    {
        this.addresses[i].provinceNormalize = utilCtrl.normalizeString(this.addresses[i].province);
        this.addresses[i].countryNormalize = utilCtrl.normalizeString(this.addresses[i].country);
    }
    this.createdAt = utilCtrl.getCurrentDate();
    if (this.isOneCode == true)
        this.voucherCode = utilCtrl.generateCode();
    next();
});

mongoose.model('Promotion', promotionSchema);

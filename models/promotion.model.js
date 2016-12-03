/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var promotionSchema = mongoose.Schema({
    providerId: String,

    categoryTypeID: String,

    title: String,

    poster: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Fcover_profile_background-min.jpg?alt=media&token=dbd6eae6-48e1-4ee4-9cbd-e7973314e989'
    },

    condition: {
        type: String,
        default: 'Điều kiện áp dụng voucher'
    },

    startDate: Number,

    endDate: Number,

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
        default: '%'
    },

    addresses: [{address: String}],

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

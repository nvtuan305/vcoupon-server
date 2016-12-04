/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'VCoupon User'
    },

    gender: {
        type: String,
        default: 'Khác'
    },

    email: String,

    phoneNumber: String,

    address: String,

    website: {
        type: String,
        default: 'www.vcoupon.vn'
    },

    fanpage: {
        type: String,
        default: 'www.facebook.com'
    },

    password: {
        type: String,
        default: 'vcoupon123'
    },

    avatar: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/vcoupon-1275f.appspot.com/o/images%2Fdefault%2Favatar_circle_grey_128dp.png?alt=media&token=e93733b2-cf52-4361-ac7f-37828416c879'
    },

    rating: {
        type: Number,
        default: 0.0
    },

    // Role type: NORMAL - Normal user, PROVIDER - Provider user
    role: {
        type: String,
        default: 'NORMAL'
    },

    subscribingTopic: [
        {
            publisherId: String,

            // Subscribed Type: PROVIDER - subscribing a provider
            // CATEGORY - subscribing a category
            subscribeType: {
                type: String,
                default: 'PROVIDER'
            }
        }
    ],

    pinnedPromotion: [{promotionId: String}],

    followingCount: {
        type: Number,
        default: 0
    },

    followedCount: {
        type: Number,
        default: 0
    },

    promotionCount: {
        type: Number,
        default: 0
    }
});

mongoose.model('User', userSchema);
/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'VCoupon User'
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
        default: ''
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
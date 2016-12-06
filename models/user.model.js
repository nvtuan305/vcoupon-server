/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');
var config = require('../config/app');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: config.user.defaultName
    },

    avatar: {
        type: String,
        default: config.user.defaultAvatarURL
    },

    gender: {
        type: String,
        default: config.user.gender.other
    },

    email: {
        type: String,
        lowercase: true
    },

    phoneNumber: {
        type: String,
        index: true,
        required: [true, 'Phone number is required.'],
        unique: [true, 'This phone number is registered.']
    },

    address: {
        type: String,
        trim: true
    },

    website: {
        type: String,
        trim: true,
        default: config.user.defaultWebsite
    },

    fanpage: {
        type: String,
        trim: true,
        default: config.user.defaultFanpage
    },

    password: {
        type: String,
        required: [true, 'Password is required.']
    },

    rating: {
        type: Number,
        default: 0.0
    },

    // Role type: NORMAL - Normal user, PROVIDER - Provider user
    role: {
        type: String,
        default: config.user.role.normal
    },

    subscribingTopic: [
        {
            _publisherId: {
                stype: mongoose.Schema.ObjectId,
                ref: 'User',
                unique: true
            },

            // Subscribed Type: PROVIDER - subscribing a provider
            // CATEGORY - subscribing a category
            subscribeType: {
                type: String,
                default: config.user.role.provider
            }
        }
    ],

    pinnedPromotion: [
        {
            _promotionId: {
                type: mongoose.Schema.ObjectId,
                ref: 'Promotion'
            }
        }
    ],

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
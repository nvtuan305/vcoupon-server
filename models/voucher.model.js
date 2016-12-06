/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var voucherSchema = new mongoose.Schema({
    title: String,

    _userId: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'User id is required.']
    },

    _promotionId: {
        type: ObjectId,
        ref: 'Promotion',
        required: [true, 'Promotion id is required.']
    },

    _providerId: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Provider id is required.']
    },

    voucherCode: {
        type: String,
        required: [true, 'Voucher code is required.']
    },

    // Image url
    qrCode: {
        type: String,
        required: [true, 'QR code image is required.']
    },

    startDate: {
        type: Number,
        required: [true, 'Start date is required.']
    },

    endDate: {
        type: Number,
        required: [true, 'End date is required.']
    },

    isChecked: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Voucher', voucherSchema);

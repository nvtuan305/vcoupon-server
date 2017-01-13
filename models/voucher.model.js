/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var voucherSchema = new mongoose.Schema({
    _user: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'User id is required.']
    },

    _promotion: {
        type: ObjectId,
        ref: 'Promotion',
        required: [true, 'Promotion id is required.']
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

    registeredDate: {
        type: Number,
        default: getCurrentDate()
    },

    isChecked: {
        type: Boolean,
        default: false
    }
});

voucherSchema.pre('save', function (next) {
    this.registeredDate = getCurrentDate();
    this.isChecked = false;
    next();
});

function getCurrentDate() {
    return parseInt(new Date().getTime() / 1000);
}


mongoose.model('Voucher', voucherSchema);

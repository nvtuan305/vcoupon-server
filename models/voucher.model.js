/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var voucherSchema = mongoose.Schema({
    title: String,

    userId: String,

    promotionId: String,

    providerId: String,

    voucherCode: String,

    // Image url
    qrCode: String,

    startDate: Number,

    endDate: Number,

    isChecked: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Voucher', voucherSchema);

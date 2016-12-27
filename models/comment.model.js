/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var commentSchema = new mongoose.Schema({
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

    commentedAt: {
        type: Number,
        default: getCurrentDate()
    },

    message: {
        type: String,
        required: [true, 'Message have not body']
    }
});

commentSchema.pre('save', function (next) {
    this.commentedAt = getCurrentDate();
    next();
});

function getCurrentDate() {
    return parseInt(new Date().getTime() / 1000);
}

mongoose.model('Comment', commentSchema);

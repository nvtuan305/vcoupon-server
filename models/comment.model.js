/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var commentSchema = new mongoose.Schema({
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

    commentedAt: {
        type: Number,
        default: 0
    },

    message: {
        type: String,
        required: [true, 'Message have not body']
    }
});

mongoose.model('Comment', commentSchema);

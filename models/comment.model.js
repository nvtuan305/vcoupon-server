/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    userId: String,
    promotionId: String,
    commentedAt: Number,
    message: String
});

mongoose.model('Comment', commentSchema);

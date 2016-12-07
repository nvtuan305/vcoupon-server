/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    _userId: String,
    accessToken: String,
    refreshToken: String,
    expireIn: Number,
    createdAt: {
        type: Date,
        set: Date.now
    }
});

mongoose.model('Token', tokenSchema);



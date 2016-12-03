/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
    userId: String,
    accessToken: String,
    refreshToken: String
});

mongoose.model('Token', tokenSchema);



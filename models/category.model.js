/**
 * Created by apismantis on 03/12/2016.
 */

var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    name: String,
    cover: String,
    type: {
        type: String,
        default: 'FOOD'
    }
});

mongoose.model('Category', categorySchema);
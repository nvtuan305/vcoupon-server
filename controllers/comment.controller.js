'use strict';

let mongoose = require('mongoose'),
    chalk = require('chalk'),
    errorCtrl = require('./error.controller.js');

let Promotion = mongoose.model('Promotion');
let User = mongoose.model('User');
let Comment = mongoose.model('Comment');

// Define default response message
let defaultErrorMessage = 'Có lỗi xảy ra. Vui lòng thử lại!',
    defaultSuccessMessage = 'Thực hiện thành công';
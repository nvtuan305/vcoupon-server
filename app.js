var express = require('express'),
    database = require('./config/database'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser');

// Define model
require('./models/category.model');
require('./models/comment.model');
require('./models/promotion.model');
require('./models/token.model');
require('./models/user.model');
require('./models/voucher.model');

// API routes
var index = require('./routes/index.router'),
    category = require('./routes/category.router'),
    user = require('./routes/users.router.js'),
    promotion = require('./routes/promotion.router');

var app = express();
database.connect();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Register middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Route API URL
app.use('/', index);
app.use('/api/v1/categories', category);
app.use('/api/v1/users', user);
app.use('/api/v1/promotions', promotion);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function (err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

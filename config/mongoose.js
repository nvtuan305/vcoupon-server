/**
 * Created by apismantis on 03/12/2016.
 */

var config = require('./config'),
    chalk = require('chalk'),
    mongoose = require('mongoose');

// Connect to database
module.exports.connect = function () {
    mongoose.connect(config.db.uri, function (err) {
        if (err) {
            console.error(chalk.red('Could not connect to mlab database!'));
            console.log(err);
        } else {
            // Enable mongoose debug mode
            mongoose.set('debug', config.db.debug);
            console.info(chalk.bgGreen.bold('Connected to mlab database!'));
        }
    });
};

// Disconnect to database
module.exports.disconnect = function () {
    mongoose.disconnect(function (err) {
        if (err) {
            console.info(chalk.yellow('Disconnected to mlab database!'));
        }
    });
};

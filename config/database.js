/**
 * Created by apismantis on 03/12/2016.
 */

var config = require('./development'),
    chalk = require('chalk'),
    mongoose = require('mongoose');

// Connect to database
module.exports.connect = function () {
    // mongoose.connect(config.db.uri, function (err) {
    //     if (err) {
    //         console.error(chalk.red('Could not connect to mlab database!'));
    //         console.log(err);
    //     } else {
    //         // Enable database debug mode
    //         mongoose.set('debug', config.db.debug);
    //         console.info(chalk.bgGreen.bold('Connected to mlab database!'));
    // Remove all data then reinitialize
    // seedDatabase();
    //     }
    // });

    mongoose.connect(config.db.local.uri, function (err) {
        if (err) {
            console.error(chalk.red('Could not connect to local database!'));
            console.log(err);
        } else {
            // Enable database debug mode
            mongoose.set('debug', config.db.debug);
            console.info(chalk.bgGreen.bold('Connected to local database!'));

            // Remove all data then reinitialize
            seedDatabase();
        }
    });
};

// Disconnect to database
module.exports.disconnect = function () {
    mongoose.disconnect(function (err) {
        if (err) {
            console.info(chalk.yellow('Can not disconnected to mlab database!'));
        } else {
            console.info(chalk.bgGreen.bold('Disconnected to mlab database!'));
        }
    });
};

// Add sample data
function seedDatabase() {
    if (config.seedDB.seed) {
        let User = mongoose.model('User');
        let Promotion = mongoose.model('Promotion');
        let Category = mongoose.model('Category');
        let Comment = mongoose.model('Comment');
        let Voucher = mongoose.model('Voucher');

        console.log('\n-------------SEED DATABASE - STARTING-------------');
        console.log('Prepare to remove all data...');

        User.remove({}, removeUserDatabaseCallback);

        function removeUserDatabaseCallback(error) {
            if (error) {
                console.log('Error happened when clear USER data:');
                console.log(error);
            } else {
                console.log('->All USER data had been removed.');
                Comment.remove({}, removeCommentDatabaseCallback);
            }
        }

        function removeCommentDatabaseCallback(error) {
            if (error) {
                console.log('Error happened when clear COMMENT data:');
                console.log(error);
            } else {
                console.log('->All COMMENT data had been removed.');
                Promotion.remove({}, removePromotionDatabaseCallback);
            }
        }

        function removePromotionDatabaseCallback(error) {
            if (error) {
                console.log('Error happened when clear TRIP data:');
                console.log(error);
            } else {
                console.log('->All PROMOTION data had been removed.');
                console.log('Prepare to init new data...');
                Voucher.remove({}, removeVoucherDatabaseCallback);
            }
        }

        function removeVoucherDatabaseCallback(error) {
            if (error) {
                console.log('Error happened when clear TRIP data:');
                console.log(error);
            } else {
                console.log('->All PROMOTION data had been removed.');
                console.log('Prepare to init new data...');
                Category.remove({}, removeCategoryCallback);
            }
        }

        function removeCategoryCallback(error) {
            if (error) {
                console.log('Error happened when clear CATEGORY data:');
                console.log(error);
            } else {
                console.log('->All CATEGORY data had been removed.');
                Category.create(config.seedDB.category, initCategoryDatabaseCallback);
            }
        }

        function initCategoryDatabaseCallback(error, categories) {
            if (error) {
                console.log('Error happened when create CATEGORY data:');
                console.log(error);
            } else {
                console.log('CATEGORY data had been created.');
                User.create(config.seedDB.user, initUserDatabaseCallback);
            }
        }

        function initUserDatabaseCallback(error, user) {
            if (error) {
                console.log('Error happened when create USER data:');
                console.log(error);
            } else {
                console.log('USER data had been created.');
                Promotion.create(config.seedDB.promotions, initPromotionDatabaseCallback);
            }
        }

        function initPromotionDatabaseCallback(error, trip) {
            if (error) {
                console.log('Error happened when create PROMOTION data:');
                console.log(error);
            } else {
                console.log('PROMOTION data had been created.');
                console.log('-------------SEED DATABASE - DONE-------------');
            }
        }
    }
}

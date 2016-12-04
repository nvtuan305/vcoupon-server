/**
 * Created by apismantis on 04/12/2016.
 */

var mongoose = require('mongoose'),
    chalk = require('chalk'),
    tokenController = require('../controllers/token.controller');

var User = mongoose.model('User');

/**
 * Sign up new account
 * @param req: Request body
 * @param res: Response
 */
module.exports.signUp = function (req, res) {
    // Check request data
    if (req.body.phoneNumber == "" || req.body.phoneNumber == null) {
        res.status(400).json({success: false, message: 'Opp! Please enter your phone number and try again!'});
        return;
    }

    User.findOne({phoneNumber: req.body.phoneNumber}, function (err, user) {
        // Has an error when find user
        if (err) {
            res.status(500).json({success: false, message: 'Opp! An error has occurred. Please try again!'});
        }

        // Existing the same user in database
        else if (user) {
            res.status(409).json({
                success: false, message: 'Opp! This user has already registered. ' +
                'Please sign in or create new account!'
            });
        }

        // Create new account
        else {
            if (isValidUser(req.body)) {
                req.body.email = req.body.email.toLowerCase();

                User.create(req.body, function (err, user) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'Opp! An error has occurred. Please try again!'
                        });
                    }
                    else {
                        console.log(chalk.blue('Sign up successfully!'));
                        // console.log(user);

                        var token = tokenController.getAccessToken(user._id, user.phoneNumber);
                        res.status(200).json({
                            success: true,
                            message: 'Sign up successfully!',
                            accessToken: token,
                            user: user.toJSON()
                        });
                    }
                });
            }

            // Invalid user
            else {
                res.status(400).json({
                    success: false,
                    message: 'Opp! Please enter all field and try again!'
                });
            }
        }
    });
};

/**
 * Sign in account
 * @param req: Request body
 * @param res
 */
module.exports.signIn = function (req, res) {
    // Check request data
    if (req.body.email == "" || req.body.email == null || req.body.password == "" || req.body.password == null) {
        res.status(401).json({success: false, message: 'Opp! Please enter your email and password to login!'});
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    User.findOne({email: req.body.email, password: req.body.password}, function (err, user) {
        // Has an error when find user
        if (err) {
            res.status(500).json({success: false, message: 'Opp! An error has occurred. Please try again!'});
        }
        // Wrong email or password
        else if (!user) {
            res.status(401).json({success: false, message: 'Wrong email or password!'});
        }
        else {
            var token = tokenController.getAccessToken(user._id, user.phoneNumber);
            res.status(200).json({
                success: true,
                message: 'Sign in successfully!',
                accessToken: token,
                user: user.toJSON()
            });
        }
    });
};

/**
 * Check user info is valid or invalid
 * @param user: user info
 * @returns {boolean} true - valid, false - invalid
 */
function isValidUser(user) {
    // Wrong role
    if (user.role == null || (user.role != 'NORMAL' && user.role != 'PROVIDER'))
        return false;

    if (user.name == "" || user.name == null
        || user.email == "" || user.email == null
        || user.phoneNumber == "" || user.phoneNumber == null
        || user.password == "" || user.password == null)
        return false;

    // Provider user
    if (user.role == 'PROVIDER') {
        if (user.address == "" || user.address == null)
            return false;
    }

    return true;
}

/***
 * Get user info
 * @param req
 * @param res
 */
module.exports.getUserInfo = function (req, res) {
    User.findOne({_id: req.params.userId}, function (err, user) {
        if (err || !user) {
            res.status(404).json({success: false, message: 'User not found!'});
        }
        else {
            res.status(200).json(user.toJSON());
        }
    });
};
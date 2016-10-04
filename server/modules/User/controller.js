/**
 * Created by nattanlucena on 19/07/16.
 */
'user strict';
var User = require('./model');
var B = require('bluebird');


/**
 * Verify if an user already exists. Case false, create a new user. Case true, return
 *  a message in callback
 *
 * @param {Object} req
 * @param {String} req.name
 * @param {String} req.email
 * @param {String} req.password
 * @param {Function} res - Callback : res(err, data)
 */
var create = function (req, res) {

    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var message = {
                message: 'User already created!'
            };
            res(message);
        } else {
            User(req).save(function (err, data) {
                if (err) {
                    if (err.name === 'ValidationError') {
                        var message = {
                            message: 'Verify required fields!'
                        };
                        res(message);
                    }
                    var err = new Error(err);
                    throw err;
                }
                //User successfully created
                var message = {
                    message: 'The user was created successfully!'
                };
                res(message);
            });
        }

    });

};

/**
 *  Get an user by email
 *
 * @param {Object} req
 * @param {String} req.email
 * @param res
 */
var findByEmail = function (req, res) {

    if(req.userEmail !== '') {
        User.findOne({email: req.userEmail}, function (err, data) {
            if (err) {
                var err = new Error(err);
                throw err;
            }

            if (data !== null) {
                var result = {
                    name: data.name,
                    email: data.email,
                    id:data._id
                };

                res(result);
            } else {
                var message = {
                    message: 'User not found!'
                };
                res(message);
            }

        });
    } else {
        var message = {
            message: 'Please insert a user ID!'
        };
        res(message);
    }
};

/**
 *  Get an user by id
 *
 * @param {Object} req
 * @param {String} req.id
 * @param res
 */
var findById = function (req, res) {

    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

    if(checkForHexRegExp.test(req.id)) {
        User.findById(req.id, function (err, data) {
            if (err) {
                var err = new Error(err);
                throw err;
            }

            if (data !== null) {
                var result = {
                    name: data.name,
                    email: data.email,
                    id:data._id
                };

                res(result);
            } else {
                var message = {
                    message: 'User not found!'
                };
                res(message);
            }

        });
    } else {
        var message = {
            message: 'No user found!'
        };
        res(message);
    }
};

/**
 *  Strategy for login
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {String} req.password
 * @param {Function} res - Callback : res(err, isMatch, message)
 */

var login = function (req, res) {
    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        var message;
        if (!data) {
            message = {
                message: 'User not found, but was Created!'
            };
            

            var user = new User({email: req.email, password: req.password})
                .save(function(err, data) {
                    if (err) {
                        var err = new Error(err);
                        throw err;
                    }

                    res(null, {id:data._id,email:data.email, name: data.name});
            });
            
        } else {
            var dados = data;
            var user = new User({email: req.email, password: req.password});
            user.comparePassword(req.password, data.password, function (err, data) {
               if (data) {
                    
                    res(null, {id:dados._id,email:dados.email, name: dados.name});
               } else {
                   message = 'Incorrect password!';
                   res(null, false, message);
               }
            });
        }
    });
};

/**
 *  Remove a user account
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {Function} res - Callback
 */
var remove = function (req, res) {

    User.findOneAndRemove({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }
        var message;
        if (data) {
            message = {
                message: 'The user was removed successfully!'
            };

        } else {
            message = {
                message: 'TUser not found!'
            };
        }

        res(message);
    });

};

module.exports = {
    create : create,
    login: login,
    findByEmail: findByEmail,
    findById: findById,
    remove: remove
};
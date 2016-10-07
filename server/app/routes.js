/**
 * Created by nattanlucena on 19/07/16.
 */

var express = require('express');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var BASE_PATH = '/api/v1';
var webAppPath = '/client/app';
var webAppPublicPath = '/client/public';

//controllers
var UserController = require('../modules/User/controller');
var ContactController = require('../modules/Contact/controller');

module.exports = function (app) {

    function errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.render('error', { error: err });
    }

    app.use(errorHandler);

    // =========================================================================
    // DEFAULT =================================================================
    // =========================================================================

    app.get(BASE_PATH, function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Turma Android 02 API');
    });

    // =========================================================================
    // Main Routes =============================================================
    // =========================================================================

    //get an user by email
    app.get(BASE_PATH + '/users/:id', function (req, res) {
        UserController.findById(req.params, function (data) {
            res.json(data);
        });
    });
    
    //create a new user
    /*app.post(BASE_PATH + '/user/create', function (req, res) {
        UserController.create(req.body, function (data) {
            res.json(data);
        });
    });*/

    //user login
    app.post(BASE_PATH + '/users/login', function (req, res) {
        UserController.login(req.body, function (err, data, message) {
           if (err) {
               res.json(err);
           }
           //return true if login is correct
           if (data) {
               res.json(data);
           }
           if (message) {
              res.json(message);
           }
       });
    });

    //delete an user
    app.delete(BASE_PATH + '/users/remove', function (req, res) {
        UserController.remove(req.query, function (data) {
          res.json(data);
       });
    });

    // =========================================================================
    // CONTACT ROUTES ============================================================
    // =========================================================================

    app.post(BASE_PATH + '/contacts/create', function (req, res) {
        ContactController.addContact(req.body, function(data) {
            res.json(data);
        });
    });

    app.get(BASE_PATH + '/users/:userId/contacts/', function (req, res) {
        ContactController.getAllByUser(req.params, function(data) {
            res.json(data);
        })
    });

    app.get(BASE_PATH + '/contacts/:id', function (req, res) {
        ContactController.findById(req.params, function(data) {
            res.json(data);
        })
    });

    app.delete(BASE_PATH + '/contacts', function (req, res) {
        ContactController.remove(req.body, function(data) {
            res.json(data);
        });
    });

    app.post(BASE_PATH + '/contacts/remove', function (req, res) {
        ContactController.remove(req.body, function(data) {
            res.json(data);
        });
    });

    module.exports = app;
};

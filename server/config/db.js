/**
 * Created by nattanlucena on 19/07/16.
 */
var mongoose = require('mongoose');
var db = mongoose.connection;
var url = 'mongodb://localhost/android02api';


//###################
db.on('error', console.error.bind(console, 'Connection error!'));

module.exports = {
    db: db,
    url : url
};

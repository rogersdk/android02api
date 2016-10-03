/**
 * Contact mongodb schema
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//###################
var contactSchema = new Schema({
        name: String,
        lastName: String,
        email: {type: String, required: true, index: { unique: true } },
        phone: {type: String, required: true},
        userId: {type: String, required: true}
    },
    {collection: 'contact'});


module.exports = contactSchema;
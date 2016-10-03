/**
 * Contact mongoose model creation
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var schema = require('./schema');
var schemaName = 'Contact';

module.exports = mongoose.model(schemaName, schema);
// load the things we need
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// define the schema for our user model
var docSchema = mongoose.Schema({

    user: String,
    title: String,
    content: String,
    created: String

});

docSchema.plugin( autoIncrement.plugin, 'Doc' );

// create the model for users and expose it to our app
module.exports = mongoose.model('Doc', docSchema);

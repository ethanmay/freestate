var mongoose = require('mongoose');

var User = mongoose.model('User', {
  oauthID: Number,
  created: Date,
  access_token: String
});

module.exports = User;
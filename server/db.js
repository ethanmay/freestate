var config = require('./oauth.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('freestate', config.dbuser, config.dbpass, { host: 'localhost', dialect: 'mysql' });

var User = sequelize.define('user', {
  oauthID: Sequelize.STRING,
  created: Sequelize.DATE,
  access_token: Sequelize.STRING
});

User.sync();

module.exports = User;
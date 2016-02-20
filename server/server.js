// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var cors 	 = require('cors');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var mongoStore = require('connect-mongo')(session);

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	clear_interval: 900,
	cookie: { maxAge: 48 * 60 * 60 * 1000 },
	secret: 'ilovescotchscotchyscotchscotch',
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({
        url: configDB.url,
        collection : 'sessions'
    })
}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
require('./app/routes.js')(app, passport, cors); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// dependencies
var express = require('express');
var config = require('./oauth.js');
var passport = require('passport');
var util = require('util');
var User = require('./db.js');
var fbAuth = require('./authentication.js');
var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: config.secret }));
  app.use(passport.initialize());
  app.use(passport.session());
});

// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    console.log(user);
      if(!err) done(null, user);
      else done(err, null);
    });
});

// app.get('/auth/check',

// );

/*
    Success/Fail Routes
 */
function renderSuccess( res, user, info ) {
  res.render('after-auth', { state: 'success', user: user ? user : null, info: info ? info : null });
};

function renderFailure( res, err ) {
  res.render('after-auth', { state: 'failure', user: null, info: null, error: err });
};

/*
    Facebook Auth
 */
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate( 'facebook' ),
  function( req, res ) {
    console.log(req.user);
    // if( err || !user ){ renderFailure( res, err ); }
    // renderSuccess( res, user, info );
});

/*
    Twitter Auth
 */
app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){});

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

/*
    Github Auth
 */
app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

/*
    Google Auth
 */
app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
  ] }
));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

/*
    Instagram Auth
 */
app.get('/auth/instagram',
  passport.authenticate('instagram'),
  function(req, res){});

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/account');
  });

/*
    Logout
 */
app.delete('/auth', function(req, res) {
  // req.logout();
  // res.writeHead(200);
  // res.end();
});



// port
app.listen(1337, function(){
  console.log('Serving at port 1337');
});

module.exports = app;

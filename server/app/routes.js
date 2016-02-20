module.exports = function(app, passport, cors) {

    var corsOptions = { origin: 'http://localhost:9000' };

// normal routes ===============================================================

    // AUTH CHECK =========================
    app.get('/auth/check', cors(corsOptions), isLoggedIn, function(req, res) {
        res.send( req.user );
    });

    // LOGOUT ==============================
    app.options('/logout', cors(corsOptions));
    app.delete('/logout', cors(corsOptions), function(req, res, next) {
        req.logout();
        res.writeHead(200);
        res.end();
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------

        // LOGIN ===============================
        app.options('/login', cors(corsOptions));
        app.post('/login', cors(corsOptions), passport.authenticate('local-login'), function( req, res ) {
            req.login( req.user, function( err ) {
                if (err) { return next(err); }
                res.send( req.user );
            });
        });

        // SIGNUP =================================
        app.options('/signup', cors(corsOptions));
        app.post('/signup', cors(corsOptions), passport.authenticate('local-signup'), function( req, res ) {
            req.login( req.user, function( err ) {
                if (err) { return next(err); }
                res.send( req.user );
            });
        });

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook'), function( req, res ) {
                if( req.user ) {
                    renderSuccess( res, req.user );
                } else {
                    renderFailure( res, res.err );
                }
            });

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter'), function( req, res ) {
                if( req.user ) {
                    renderSuccess( res, req.user );
                } else {
                    renderFailure( res, res.err );
                }
            });


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google'), function( req, res ) {
                if( req.user ) {
                    renderSuccess( res, req.user );
                } else {
                    renderFailure( res, res.err );
                }
            });

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.options('/connect/local', cors(corsOptions));
        app.post('/connect/local', cors(corsOptions), passport.authenticate('local-signup'), function( req, res ) {
            res.send( req.user );
        });

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook'));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }), function( req, res ) {
                if( req.user ) {
                    renderSuccess( res, req.user );
                } else {
                    renderFailure( res, res.err );
                }
            });


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google'), function( req, res ) {
                if( req.user ) {
                    renderSuccess( res, req.user );
                } else {
                    renderFailure( res, res.err );
                }
            });

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', cors(corsOptions), isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.send( user );
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', cors(corsOptions), isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.send( user );
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', cors(corsOptions), isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.send( user );
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', cors(corsOptions), isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.send( user );
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.send( false );
}

/*
    Success/Fail Routes
 */
function renderSuccess( res, user ) {
    res.render('after-auth', { state: 'success', user: user, error: null });
};

function renderFailure( res, err ) {
    res.render('after-auth', { state: 'failure', user: null, error: err });
};

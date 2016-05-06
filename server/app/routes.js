module.exports = function(app, passport, cors) {

    var corsOptions = { origin: 'http://localhost:9000' };
    var Document    = require('./models/document');
    var User        = require('./models/user');

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

    // =============================================================================
    // DOCUMENT ROUTES =============================================================
    // =============================================================================
    app.options('/user/doc', cors(corsOptions));
    app.route('/user/:userId/doc')
        .all( cors(corsOptions), isLoggedIn )
        .get( function(req, res) {
            Document.find({ user: req.params.userId }, function( err, docs ) {
                if( err )
                    res.status(500).send();

                if( docs )
                    res.send( docs );

                else
                    res.send('No documents found.');
            });
        })
        .post( function( req, res ) {
            if( !req.params.userId ) {
                res.status(401).send();
            }

            var newDoc = new Document();
            newDoc.user = req.params.userId;
            newDoc.created = req.body.created;
            newDoc.title = req.body.title;
            newDoc.content = req.body.text;
            newDoc.save( function() {
                User.findById( req.params.userId, function( err, user ) {
                    if( err ) {
                        res.status(500).send();
                    } else if( !user ) {
                        res.status(401).send();
                    } else {
                        user.documents.push( newDoc._id );
                        user.save( function() {
                            res.status(200).send();
                        });
                    }
                });
            });
        });

    app.route('/user/:userId/doc/:docId')
        .all( cors(corsOptions), isLoggedIn )
        .get( function(req, res) {
            if( req.params.docId ) {
                Document.findById( req.params.docId , function(err, doc) {
                    if( err )
                        res.status(500).send();

                    if( doc ) 
                        res.send({ doc: doc });

                    else 
                        res.status(500).send();
                });
            }
        })
        .post( function(req, res) {
            
        })
        .put( function(req, res) {
            
        })
        .delete( function(req, res) {
            
        });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).send( 'User authentication failed.' );
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


var express = require('express')
    , passport = require('passport')
    , morgan = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , session = require('express-session')
    , partials = require('express-partials')
    , InstagramStrategy = require('passport-instagram').Strategy;

var credentials = require('./credentials.json');
console.log(credentials.INSTAGRAM_CLIENT_ID);


// var INSTAGRAM_CLIENT_ID = "--insert-instagram-client-id-here--";
// var INSTAGRAM_CLIENT_SECRET = "--insert-instagram-client-secret-here--";
var INSTAGRAM_CLIENT_ID = credentials.INSTAGRAM_CLIENT_ID,
    INSTAGRAM_CLIENT_SECRET = credentials.INSTAGRAM_CLIENT_SECRET;


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Instagram profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the InstagramStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Instagram
//   profile), and invoke a callback with a user object.
passport.use(new InstagramStrategy({
        clientID: INSTAGRAM_CLIENT_ID,
        clientSecret: INSTAGRAM_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Instagram profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Instagram account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));




var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded( { extended: true } ) );
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// configure Express
// app.configure(function() {
//   app.use(partials());
//   app.set('views', __dirname + '/views');
//   app.set('view engine', 'ejs');
//   app.use(express.logger());
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   // app.use(express.methodOverride());
//   app.use(express.session({ secret: 'keyboard cat' }));
//   // Initialize Passport!  Also use passport.session() middleware, to support
//   // persistent login sessions (recommended).
//   app.use(passport.initialize());
//   app.use(passport.session());
//   app.use(app.router);
//   app.use(express.static(__dirname + '/public'));
// });


app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

// GET /auth/instagram
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Instagram authentication will involve
//   redirecting the user to instagram.com.  After authorization, Instagram
//   will redirect the user back to this application at /auth/instagram/callback
app.get('/auth/instagram',
    passport.authenticate('instagram'),
    function(req, res){
        // The request will be redirected to Instagram for authentication, so this
        // function will not be called.
    });

// GET /callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/callback',
    passport.authenticate('instagram', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

var port = 3000;
app.listen(port, function(error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}
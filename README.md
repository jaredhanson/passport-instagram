# Passport-Instagram

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Instagram](http://instagr.am/) using the OAuth 2.0 API.

This module lets you authenticate using Instagram in your Node.js applications.
By plugging into Passport, Instagram authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-instagram

## Usage

#### Configure Strategy

The Instagram authentication strategy authenticates users using a Instagram
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new InstagramStrategy({
        clientID: INSTAGRAM_CLIENT_ID,
        clientSecret: INSTAGRAM_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/instagram/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ instagramId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'instagram'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/instagram',
      passport.authenticate('instagram'));

    app.get('/auth/instagram/callback', 
      passport.authenticate('instagram', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/jaredhanson/passport-instagram/tree/master/examples/login).

## Tests

    $ npm install --dev
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/passport-instagram.png)](http://travis-ci.org/jaredhanson/passport-instagram)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

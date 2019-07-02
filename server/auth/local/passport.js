const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const OrcidStrategy = require('passport-orcid').Strategy;
const orcidConfigStrategy = require('../../../config').orcid;
const googleConfigStrategy = require('../../../config').google;


exports.setupLogin = function (User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function (email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function (err, user) {
      if (err) return done(err)

      if (!user) {
        return done(null, false, { message: 'This email is not registered or not correct.' })
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'This password is not correct.' })
      }
      return done(null, user)
    })
  }))
}

exports.setupOrcid = function (User, config) {
  passport.use(new OrcidStrategy({
    sandbox: false,
    clientID: orcidConfigStrategy.clientId,
    clientSecret: orcidConfigStrategy.clientSecret,
    callbackURL: orcidConfigStrategy.callbackUrl
  }, function(accessToken, refreshToken, params, profile, done) {
    console.log("PARAMS : " + params.toString());
    console.log("PROFILE : " + profile.toString());
    User.findOne({ email: params.id }, function (err, user) {
      console.log('USER : ' + user)
      return done(null, user);
    });
  }))
}

exports.setupGoogle = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: googleConfigStrategy.client_id,
      clientSecret: googleConfigStrategy.client_secret,
      callbackURL: "http://www.example.com/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  ));
}

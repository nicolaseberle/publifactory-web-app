var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const OrcidStrategy = require('passport-orcid').Strategy;
const configStrategy = require('../../../config').orcid;

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
    sandbox: process.env.NODE_ENV !== 'production',
    clientID: configStrategy.clientId,
    clientSecret: configStrategy.clientSecret,
    callbackURL: configStrategy.callbackUrl
  }, function(accessToken, refreshToken, params, profile, done) {
    User.findOne({ orcid: params.id }, function (err, user) {
      return done(err, user);
    });
  }))
}

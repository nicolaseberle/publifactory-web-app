'use strict'

// var mongoose = require('mongoose')
// var passport = require('passport')
const config = require('../../config').backend
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const UserModel = require('../api/user/user.model')
const validateJwt = expressJwt({ secret: config.secrets.session })

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 401
 */
function isAuthenticated () {
  return compose()
    // Validate jwt
    .use(function (req, res, next) {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token // eslint-disable-line
      }
      validateJwt(req, res, next)
    })
    // Attach user to request
    .use(async function (req, res, next) {
      await new Promise((resolve, reject) => {
        UserModel.findById(req.user._id, async function (err, user) {
          if (err) reject(err)
          if (!user) return res.sendStatus(401)
          req.user = user
          next()
        })
      })
    })
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole (roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set')

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements (req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next()
      } else {
        res.sendStatus(403)
      }
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken (user) {
  return jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie (req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.' })
  var token = signToken(req.user)
  res.cookie('token', JSON.stringify(token))
  res.redirect('/')
}

module.exports = {
  isAuthenticated: isAuthenticated,
  hasRole: hasRole,
  signToken: signToken,
  setTokenCookie: setTokenCookie
}

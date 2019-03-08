/**
 * Main application routes
 */

'use strict'

var errors = require('./components/errors')
var config = require('../config').backend
var path = require('path')

module.exports = function (app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'))
  app.use('/api/users', require('./api/user'))
  app.use('/api/articles', require('./api/article'))
  app.use('/api/journals', require('./api/journal'))
  app.use('/api/comments', require('./api/comment'))
  app.use('/api/data', require('./api/data'))
  app.use('/api/figure', require('./api/figure'))
  app.use('/api/auth', require('./auth'))
  app.use('/api/emailer', require('./api/email'))

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|static)/*').get(errors[404])

  // All other routes should redirect to the index.html
  if (config.serverFrontend) {
    app.route('/*').get(function (req, res) {
      res.sendFile(path.join(config.frontend, '/index.html'))
    })
  }
}

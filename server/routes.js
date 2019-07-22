/**
 * Main application routes
 */

'use strict'

var errors = require('./components/errors')
var config = require('../config').backend
var path = require('path')

const jwtCheck = require('./auth/jwt');

module.exports = function (app) {
  // Insert routes below
  app.use('/api/users', require('./api/user'))
  app.use('/api/auth', require('./auth'))
  app.use('/api/invitations', require('./api/invitations'))

  app.use(function(req, res, next) {
    jwtCheck(req, res, next);
  })

  app.use('/api/articles', require('./api/article'))
  app.use('/api/journals', require('./api/journal'))
  app.use('/api/comments', require('./api/comment'))
  app.use('/api/data', require('./api/data'))
  app.use('/api/figure', require('./api/figure'))
  app.use('/api/converter', require('./Converter'))
  app.use('/api/roles', require('./api/roles'))
  app.use('/api/pictures', require('./api/picture'))
  app.use('/api/history', require('./api/article/history'))

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next({ code: 404, message: 'This route does not exist.' });
  });

  // error handling
  app.use(function(err, req, res, next) {
    try {
      res.status(err.code ? err.code : 500).json({
        success: false,
        message: err.message ? err.message : "Something went wrong"
      });
    } catch (e) {
      return res.status(500).json({
        success : false,
        message : "Unknown server error."});
    }
  });
};

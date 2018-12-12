/**
 * Main application file
 */

'use strict'

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors')
var config = require('../config').backend
var serveStatic = require('serve-static');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options)

// insure DB with admin user data
require('./config/seed')

// Setup server
var app = express()
app.use(cors())
var server = require('http').createServer(app)
var socketio = require('socket.io')(server)
require('./config/socketio')(socketio)
require('./config/express')(app)
require('./routes')(app)

if(process.env.NODE_ENV == 'production'){
  app.use(serveStatic(__dirname + "/client/dist"));
  console.log("listen port :"+ config.port)
}

server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'))
})


// Expose app
exports = module.exports = app

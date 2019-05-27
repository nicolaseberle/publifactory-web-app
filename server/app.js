/**
 * Main application file
 */

'use strict'

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express = require('express')
var favicon = require('express-favicon');
var mongoose = require('mongoose')
var cors = require('cors')
var config = require('../config').backend
var serveStatic = require('serve-static');
var path = require('path');
var url = require('url');
const logger = require('morgan');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options)

// insure DB with admin user data
require('./config/seed')

// Setup server
var app = express()
app.use(cors())
app.use(logger('dev'));
var server = require('http').createServer(app)
var socketio = require('socket.io')(server)
require('./config/socketio')(socketio)
require('./config/express')(app)
require('./routes')(app)

if(process.env.NODE_ENV == 'production'){
  //app.use('/static', express.static(path.join(__dirname, '/../client/dist/static')))
  //app.use(favicon(path.join(__dirname, '/../client/dist/static/favicon.ico')));
  app.use(serveStatic(__dirname + "/../client/dist"));
  console.log(__dirname + "/../client/dist")
  console.log("listen port :"+ config.port)
}

server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'))
})

// init websockets servers
var wssShareDB = require('./helpers/wss-sharedb')(server);
var wssCursors = require('./helpers/wss-cursors')(server);

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;
  console.log(pathname)

  if (pathname === '/sharedb') {
    wssShareDB.handleUpgrade(request, socket, head, (ws) => {
      wssShareDB.emit('connection', ws);
      console.log("wssShareDB connection")
    });
  } else if (pathname === '/cursors') {
    wssCursors.handleUpgrade(request, socket, head, (ws) => {
      wssCursors.emit('connection', ws);
      console.log("wssShareDB connection")
    });
  } else {
    socket.destroy();
  }
});

// Expose app
exports = module.exports = app

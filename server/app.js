/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const favicon = require('express-favicon');
const mongoose = require('mongoose');
const config = require('../config').backend;
const serveStatic = require('serve-static');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options).then(() => console.log('Server is connected to mongoDB.'));

// insure DB with admin user data
// require('./config/seed')

// SSL/TLS definition
const privateKeyApi = fs.readFileSync(path.join(__dirname, '../ssl/api_publifactory.key'));
const certificateApi = fs.readFileSync(path.join(__dirname, '../ssl/api_publifactory.crt'));
const credentialsApi = {
  key: privateKeyApi,
  cert: certificateApi
};

// Setup server
const app = express();
const serverApi = require('https').createServer(credentialsApi, app);
const serverSocket = require('http').createServer(app);
const socketIo = require('socket.io')(serverSocket);
const socketOptions = {
  origins: "https://localhost:* https://127.0.0.1:* https://app.publifactory.co:*",
};
require('./config/socketio')(socketIo, socketOptions);
require('./config/express')(app);
require('./routes')(app);

if (process.env.NODE_ENV === 'production') {
  //app.use('/static', express.static(path.join(__dirname, '/../client/dist/static')))
  //app.use(favicon(path.join(__dirname, '/../client/dist/static/favicon.ico')));
  app.use(serveStatic(__dirname + "/../client/dist"));
  console.log(__dirname + "/../client/dist")
  console.log("listen port :"+ config.port)
}

serverApi.listen(config.port, config.ip,  function () {
  console.log('Express side server listening on %d, in %s mode', config.port, app.get('env'))
});

serverSocket.listen(config.socketPort, config.ip, function () {
  console.log('Socket side server is listening on %d, in %s mode', config.socketPort, app.get('env'))
});

// Expose app
exports = module.exports = app;

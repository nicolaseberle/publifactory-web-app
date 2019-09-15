/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const favicon = require('express-favicon');
const config = require('../config').backend;
const serveStatic = require('serve-static');
const path = require('path');
const url = require('url');
const fs = require('fs');

// insure DB with admin user data
// require('./config/seed')

/**
 * Initiate SSL/TLS
 * We verify certbot's certificate and private keys.
 * If doesn't exist, we take an unsecured certificate.
 */
/*
const credentials = {
  key: (fs.existsSync('/etc/letsencrypt/live/api.publifactory.co/privkey.pem') === true
      ? fs.readFileSync('/etc/letsencrypt/live/api.publifactory.co/privkey.pem')
      : fs.readFileSync(path.join(__dirname, '../ssl/key.pem'))),
  cert: (fs.existsSync('/etc/letsencrypt/live/api.publifactory.co/fullchain.pem') === true
      ? fs.readFileSync('/etc/letsencrypt/live/api.publifactory.co/fullchain.pem')
      : fs.readFileSync(path.join(__dirname, '../ssl/server.crt')))
};
*/

// Setup server
const app = express();
const serverApi = require('http').createServer(app);
const serverWS = require('http').createServer(app);

const socketIo = require('socket.io')(serverApi);
require('./config/database')();
require('./config/socketio')(socketIo);
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

// init websockets servers
var wssShareDB = require('./helpers/wss-sharedb')(serverWS);
var wssCursors = require('./helpers/wss-cursors')(serverWS);

serverWS.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/sharedb') {
    wssShareDB.handleUpgrade(request, socket, head, (ws) => {
      wssShareDB.emit('connection', ws);
    });
  } else if (pathname === '/cursors') {
    wssCursors.handleUpgrade(request, socket, head, (ws) => {
      wssCursors.emit('connection', ws);
    });
  } else {
    socket.destroy();
  }
});

serverWS.listen(4002, config.ip,  function () {
  console.log('Express side server listening on %d, in %s mode', config.port, app.get('env'))
});

// Expose app
exports = module.exports = app;

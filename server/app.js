/**
 * Main application file
 */

'use strict'
console.log('ENV::::::', process.env.NODE_ENV)
// Set default node environment to development
// process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const express = require('express')
const http = require('http')
const favicon = require('express-favicon')
const config = require('../config').backend
const serveStatic = require('serve-static')
const path = require('path')
const url = require('url')
const fs = require('fs')

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
const app = express()
const server = http.createServer(app)
const wsShareDB = require('./config/ws-sharedb/')

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname
  if (pathname === '/collaboration') {
    wsShareDB.handleUpgrade(request, socket, head, function done (socket) {
      console.log('WSSHAREDB::UPGRADE')
      wsShareDB.emit('connection', socket, request)
    })
  }
})

const socketIo = require('socket.io')(server)

require('./config/database')()
require('./config/socketio')(socketIo)
require('./config/express')(app)
require('./routes')(app)

server.listen(config.port, config.ip, function () {
  console.log(
    'Express side server listening on %d, in %s mode',
    config.port,
    app.get('env')
  )
})

// Expose app
exports = module.exports = app

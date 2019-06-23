var ReconnectingWebSocket = require('reconnectingwebsocket')

// var config = require('../../../../../config').backend

var Chance = require('chance')
var chance = new Chance()
var socketAddress = ''
// const list_color = ['#a9997e', '#cd051d', '#303c79', '#157fde', '#f6662e', '#de3c1b']

if (process.env.NODE_ENV === 'production') {
  socketAddress = ((window.location.protocol === 'https:') ? 'wss' : 'ws') + '://' + window.location.hostname + '/cursors'
} else {
  socketAddress = ((window.location.protocol === 'https:') ? 'wss' : 'ws') + '://' + window.location.hostname + ':4000/cursors'
}

console.log(process.env.NODE_ENV, socketAddress)

class CursorConnection {
  constructor (name, color) {
    this.id = null
    this.name = name
    this.color = color
  }
  getId () {
    if (this.id) return this.id
  }
  setId (_id) {
    this.id = _id
  }
}

export default class Cursors {
  constructor (idIndicator, idState, username) {
    // this.socketStateEl = document.getElementById(idState)
    // this.socketIndicatorEl = document.getElementById(idIndicator)

    // Create browserchannel socket
    this.socket = new ReconnectingWebSocket(socketAddress)
    // this.socketStateEl.innerHTML = 'connecting'
    // this.socketIndicatorEl.style.backgroundColor = 'silver'

    // Init a blank user connection to store local conn data
    this.localConnection = new CursorConnection(
      null,
      chance.color({
        format: 'hex'
      })
    )

    this.localConnection.name = username

    // Init connections array
    this.connections = []

    // Send initial message to register the client, and
    // retrieve a list of current clients so we can set a colour.
    var self = this
    this.socket.onopen = function () {
      // self.socketStateEl.innerHTML = 'connected'
      // self.socketIndicatorEl.style.backgroundColor = 'lime'
      self.update()
    }

    // Handle updates
    this.socket.onmessage = function (message) {
      var data = JSON.parse(message.data)

      var source = {}
      var removedConnections = []
      var forceUpdate = false
      var reportNewConnections = true
      if (!self.localConnection) {
        if (!self.localConnection.getId()) {
          forceUpdate = true
        }
      }

      // Refresh local connection ID (because session ID might have changed because server restarts, crashes, etc.)
      self.localConnection.setId(data.id)

      if (forceUpdate) {
        self.update()
        return
      }

      // Find removed connections
      for (var i = 0; i < self.connections.length; i++) {
        var testConnection = data.connections.find(function (connection) {
          return self.localConnection.id === self.connections[i].id
        })

        if (!testConnection) {
          removedConnections.push(self.connections[i])
          console.log('[cursors] User disconnected:', self.connections[i])

          // If the source connection was removed set it
          if (data.sourceId === self.connections[i]) {
            source = self.connections[i]
          }
        } else if (testConnection.name && !self.connections[i].name) {
          console.log('[cursors] User ' + testConnection.id + ' set username:', testConnection.name)
          console.log('[cursors] Connections after username update:', data.connections)
        }
      }

      if (self.connections.length === 0 && data.connections.length !== 0) {
        console.log('[cursors] Initial list of connections received from server:', data.connections)
        console.log('[cursors] ', self.connections.length)
        console.log('[cursors] ', data.connections.length)
        reportNewConnections = false
      }

      for (var i_ = 0; i_ < data.connections.length; i_++) {
        // Set the source if it's still on active connections
        if (data.sourceId === data.connections[i_].id) {
          source = data.connections[i_]
        }

        if (reportNewConnections && !self.connections.find(function (connection) {
          return connection.id === data.connections[i_].id || connection.name === data.connections[i_].name
        })) {
          console.log('[cursors] User connected:', data.connections[i_])
          console.log('[cursors] Connections after new user:', data.connections)
        }
      }

      // Update connections array
      self.connections = data.connections

      // Fire event
      var event = new window.CustomEvent('cursors-update', {
        detail: {
          source: source,
          removedConnections: removedConnections
        }
      })

      document.dispatchEvent(event)
    }

    this.socket.onclose = function (event) {
      console.log('[cursors] Socket closed. Event:', event)
      // self.socketStateEl.innerHTML = 'closed'
      // self.socketIndicatorEl.style.backgroundColor = 'red'
    }

    this.socket.onerror = function (event) {
      console.log('[cursors] Error on socket. Event:', event)
      // self.socketStateEl.innerHTML = 'error'
      // self.socketIndicatorEl.style.backgroundColor = 'red'
    }
  }
  // Update
  update () {
    this.socket.send(JSON.stringify(this.localConnection), function (error) {
      console.log(error)
    })
  }

  getLocalConnectionRange () {
    return this.localConnection.range
  }

  getLocalConnectionRangeLength () {
    return this.localConnection.range.length
  }

  setLocalConnectionRange (_range) {
    this.localConnection.range = _range
  }

  setLocalConnectionRangeIndex (_index) {
    this.localConnection.range.index = _index
  }

  setLocalConnectionRangeLength (_length) {
    this.localConnection.range.length = _length
  }
}

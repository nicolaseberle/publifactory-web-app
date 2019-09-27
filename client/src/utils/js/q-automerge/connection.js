const Automerge = require('automerge')

class Connection {
  constructor (docSet, socket) {
    this.automerge = new Automerge.Connection(docSet, msg => this.sendMsg(msg))
    this.socket = socket
    this.automerge.open()
  }

  receiveData (data) {
      this.automerge.receiveMsg(data)
  }
  sendMsg (msg) {
    if (!this.socket) return
    this.socket.emit('NEW_AUTO_DATA',msg)
  }
}

module.exports = Connection

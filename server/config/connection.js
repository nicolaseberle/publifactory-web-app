const Automerge = require('automerge')

class Connection {
  constructor (docSet, socket) {
    console.log("Connection :: constructor")
    this.socket = socket
    this.automerge = new Automerge.Connection(docSet, msg => this.sendMsg(msg))
    this.automerge.open()
  }

  receiveData (data) {
    console.log('Server :: receiveData :: ', data)
    this.automerge.receiveMsg(data)
  }
  sendMsg (msg) {
    if (!this.socket) return
    console.log("Server :: Sending :: ",msg)
    this.socket.emit('SEND_DATA_TO_CLIENT',msg)
    console.log("Server :: Sending :: return")
  }
}

module.exports = Connection

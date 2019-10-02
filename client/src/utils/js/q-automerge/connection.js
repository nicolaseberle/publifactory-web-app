const Automerge = require('automerge')

class Connection {
  constructor (docSet, socket) {
    console.log("Client :: Connection :: constructor")
    this.automerge = new Automerge.Connection(docSet, msg => this.sendMsg(msg))
    this.socket = socket
    this.automerge.open()
  }

  receiveData (data) {
      console.log('Client :: receiveData :: ', data)
      this.automerge.receiveMsg(data)
  }
  sendMsg (msg) {
    if (!this.socket) return
    console.log("Client Sending :: ",msg)
    this.socket.emit('SEND_DATA_TO_SERVER',msg)
    console.log("Client Sending :: return")
  }
}

module.exports = Connection

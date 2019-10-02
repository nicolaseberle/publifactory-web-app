const Automerge = require('automerge')
const Connection = require('./connection')


// Initialise an example document
const docSet = new Automerge.DocSet()
const initDoc = Automerge.change(Automerge.init(), doc => doc.hello = 'Hi!')
docSet.setDoc('example', initDoc)

// Print out the document whenever it changes
docSet.registerHandler((docId, doc) => {
  console.log(`[${docId}] ${JSON.stringify(doc)}`)
})

// Make a change to the document every 3 seconds
/*setInterval(() => {
  let doc = docSet.getDoc('example')
  doc = Automerge.change(doc, doc => {
    doc.serverNum = (doc.serverNum || 0) + 1
  })
  docSet.setDoc('example', doc)
}, 3000)
*/
// This function is called every time a client connects to the server socket
function handler(socket) {
  console.log(`[${socket.remoteAddress}:${socket.remotePort}] connected`)
  const connection = new Connection(docSet, socket)

  // Receiving data from the client
  socket.on('data', (data) => {
    if (!(data instanceof Buffer)) {
      data = Buffer.from(data, 'utf8')
    }
    connection.receiveData(data)
  })
}

<template>
  <div class="dashboard-container">
    {{doc}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const Automerge = require('automerge')
const Connection = require('../../../utils/js/q-automerge/connection.js')
const io = require('socket.io-client');

var randomWords = require('random-words');


export default {
  name: 'prepre',
  data () {
    return {
      socket: '',
      docSet: '',
      doc: '',
      connection : ''
    }
  },
  computed: {
    ...mapGetters(['accessToken', 'userId'])
  },
  created () {
    const socketOptions = {
      transports: [ 'polling' ],
      reconnect: true,
      rejectUnauthorized: false,
      query: {
        id_article: 'ABABABABABABABABABA',
        id_user: this.userId
      }
    };
    this.socket = io('/', socketOptions)
    this.docSet = new Automerge.DocSet()
    this.connection = new Connection(this.docSet, this.socket)
  },
  async mounted () {

    /*this.docSet.registerHandler((docId, doc) => {
      console.log(`[${docId}] ${JSON.stringify(doc)}`)
    })*/

    //const initDoc = Automerge.change(Automerge.init(), doc => doc.hello = 'Hi!')
    //this.docSet.setDoc('example', initDoc)
    this.doc = Automerge.init()
    
    console.log(this.docSet)

    // Make a change to the document every 3 seconds
    setInterval(() => {
      this.doc = this.docSet.getDoc('example')
      if (this.doc) {
        this.doc = Automerge.change(this.doc, doc => {
          this.doc.hello = this.doc.hello + ' ' + randomWords()
        })
        this.docSet.setDoc('example', this.doc)
      }
    }, 1000)

    // Receiving data from the server
    this.socket.on('EMIT_DATA', (data) => {
      this.connection.receiveData(data)
    })
  }
}
</script>

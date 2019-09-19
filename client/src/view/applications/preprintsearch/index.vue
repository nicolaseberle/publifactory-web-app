<template>
  <div >
    <section id="user">
      <article class="editor input"></article>
      <details>
        <summary>Alice CRDT State</summary>
        <pre class="crdt state"></pre>
      </details>
      <details>
        <summary>Alice Editor State</summary>
        <pre class="editor state"></pre>
      </details>
      <details>
        <summary>Messages</summary>
        <article class="messages"></article>
      </details>
    </section>
    <!--
    <section id="bob">
      <article class="editor input"></article>
      <details>
        <summary>Bob CRDT State</summary>
        <pre class="crdt state"></pre>
      </details>
      <details>
          <summary>Bob Editor State</summary>
          <pre class="editor state"></pre>
      </details>
      <details>
          <summary>Messages</summary>
          <article class="messages"></article>
        </details>
    </section>
  -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import io from 'socket.io-client'

import Conspirator from  '../../../utils/js/q-automerge/main.js'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  data() {
    return {
      id: 'mlksqdksdmksdfnml',
      socket: '',
      listConnectedUsers: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created () {
    const socketOptions = {
      transports: [ 'polling' ],
      reconnect: true,
      rejectUnauthorized: false,
      query: {
        id_article: this.id,
        id_user: this.userId
      }
    };
    this.socket = io('/', socketOptions)
  },
  mounted () {
    const current_user = new Conspirator("Alice")
    //const bob = new Conspirator("Bob")
    this.socket.on('RESULT_USERS', data => {
      this.listConnectedUsers = data;
      console.log("RESULT_USERS :: ",this.listConnectedUsers)
    });
    //alice.follow(bob)
    //bob.follow(alice)

    window.current_user = current_user
    //window.bob = bob

    alice.init(document.querySelector("#user"))
    window.setInterval(()=>{ this.socket.emit('GET_USERS',{id_article: this.id}) }, 5000);
    //bob.init(document.querySelector("#bob"))
  },
  method :{
  }
}
</script>

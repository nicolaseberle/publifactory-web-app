// @flow strict

//import * as Automerge from "./automerge.js"
export const Automerge = require('automerge')

import { FeedWriter, FeedReader } from "./feed.js"
import { Thread } from "./thread.js"

export class Collaboration /*::<a>*/ {
  /*::
  thread:Thread<Automerge.Change<a>>
  document:Automerge.Document<a>
  */
  static new(name /*:string*/ = `@{Date.now().toString(32)}`) {
    const feed = new FeedWriter(name)
    const thread = new Thread(feed)
    const document = Automerge.init()
    return new this(thread, document)
  }
  follow(feed /*:FeedReader<Automerge.Change<a>>*/) {
    this.thread.follow(feed)
  }
  constructor(
    thread /*:Thread<Automerge.Change<a>>*/,
    document /*:Automerge.Document<a>*/,
    socket
  ) {
    const docSet = new Automerge.DocSet()
    console.log(docSet)
    //connection = new Connection(docSet, socket)
    this.automerge = new Automerge.Connection(docSet, msg => this.sendMsg(msg))
    this.automerge.open()
    this.document = document //docSet.getDoc('example')// docSet.getDoc('example')
    this.thread = thread
    this.socket = socket
    this.socket.on('QUILL_NEW_MESSAGE', data => {
      this.automerge.receiveMsg(data)
    })
  }
  sendMsg (data) {
    this.socket.emit('QUILL_NEW_MESSAGE', data)
  }
  change(mutate /*:Automerge.Mutate<a>*/, comment /*::?:string*/) {
    const document = Automerge.change(this.document, comment, mutate)

    console.log(document)
    const changes = Automerge.getChanges(this.document, document)
    for (const change of changes) {
      this.thread.write(change)
    }
    this.document = document
  }
  applyChanges(change /*:Automerge.Change<a>*/) {
    this.document = Automerge.applyChanges(this.document, [change])
  }
}

import { Thread }  from "./thread.js";
import { FeedWriter } from "./feed.js"
import { Collaboration } from "./collaboration.js"

const Automerge = require('automerge')


export const Quill  = require('quill');
// window.Quill = Quill
export const QuillCursors = require('quill-cursors')
// window.QuillCursors = QuillCursors

import { QuillConspire } from "./quill-conspire.js"

export { QuillConspire }
Quill.register("modules/cursors", QuillCursors)
Quill.register("modules/conspire", QuillConspire)

const ColorHash  = require('color-hash')

import { QuillRichText } from "./RichText/Quill.js"

class Tokens /*::<a>*/ {
  /*::
  items:a[]
  @@iterator: () => Iterator<a>
  */
  constructor(items /*:a[]*/) {
    this.items = items
  }
  /* @noflow */
  *[Symbol.iterator]() {
    for (const item of this.items) {
      yield item
    }
  }
  get length() {
    return this.items.length
  }
  get(n /*:number*/) /*:a*/ {
    return this.items[n]
  }
  insertAt(offset /*:number*/, ...items /*:a[]*/) {
    this.items.splice(offset, 0, ...items)
    return this
  }
  deleteAt(offset /*:number*/, count /*:number*/) {
    this.items.splice(offset, count)
  }
}

class Conspirator {
  /**::
  root:HTMLElement
  */
  constructor(name, socket) {
    this.id = `${name}@${Date.now().toString(32)}`
    this.socket = socket
    this.feed = new FeedWriter(name)
    this.thread = new Thread(this.feed,socket)
    this.repo = new Collaboration(this.thread, Automerge.init(),socket)
  }
  get document() {
    return this.repo.document
  }
  follow(actor) {
    this.repo.follow(actor.feed)
  }
  init(root) {
    this.root = root
    this.view()
    this.repo.change(doc => {
      doc.content = [] //new Automerge.Text()
      doc.cursors = {}

      const text = new QuillRichText(new Tokens(doc.content))
      text.patch(this.editor.getContents())

      doc.cursors[this.id] = this.editor.getSelection()
    }, "init")
    this.inspect()
  }
  merge(patch) {
    this.log(patch)
    this.repo.change(doc => {
      if (patch.delta) {
        const text = new QuillRichText(new Tokens(doc.content))
        text.patch(patch.delta)
      }

      if (patch.selection) {
        doc.cursors[this.id] = patch.selection
      }
    })
    this.inspect()
  }
  async watch() {
    for await (const { member, message } of this.thread.messages) {
      if (member !== this.feed) {
        console.log("watch await",member,message)
        this.receive(message)
      }
    }
  }
  receive(message) {
    console.log('receive message')
    const cursors = this.document.cursors || {}
    this.repo.applyChanges(message)
    const text = new QuillRichText(new Tokens(this.document.content))
    console.log(text)
    const delta = text.toContent()
    this.editor.setContents(delta)
    for (const name in this.document.cursors) {
      const cursor = this.document.cursors[name]
      if (cursor && !cursors[name]) {
        this.cursors.createCursor(name, name, new ColorHash().hex(name))
        this.cursors.moveCursor(name, cursor)
      } else if (!cursor && cursors[name]) {
        this.cursors.removeCursor(name)
      } else {
        this.cursors.moveCursor(name, cursor)
      }
    }

    this.inspect()
  }
  get cursors() {
    return this.editor.getModule("cursors")
  }
  view() {
    this.editor = new Quill(this.root.querySelector(".editor.input"), {
      modules: {
        cursors: true,
        conspire: this,
        toolbar: {
          container: [
            [{ header: 1 }, { header: 2 }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ color: [] }],
            [{ list: "bullet" }],
            ["link", "image"]
          ]
        }
      },
      theme: "snow",
      placeholder: "Start writing.\n\nSelect the text for formatting options."
    })
    //this.watch()
    this.socket.on('QUILL_SEND_MESSAGE', message => {
      console.log('QUILL_SEND_MESSAGE',message)
      this.receive(message)
    });
    return this
  }

  log(message) {
    const container = this.root.querySelector(".messages")
    const row = document.createElement("pre")
    row.textContent = JSON.stringify(message)
    container.insertBefore(row, container.firstChild)
    const [_1, _2, _3, _4, _5, ...rest] = container.childNodes
    for (const child of rest) {
      child.remove()
    }
  }
  inspect() {
    this.root.querySelector(".crdt.state").textContent = JSON.stringify(
      new QuillRichText(new Tokens(this.document.content)).toJSON()
    )
    this.root.querySelector(".editor.state").textContent = JSON.stringify(
      this.editor.getContents(),
      null,
      2
    )
  }
}

export default Conspirator;

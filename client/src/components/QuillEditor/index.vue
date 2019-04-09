<template>
  <div>
  <div>
      <span v-bind:id="idSharedbSocketIndicator" class='socket-indicator' style='display:none;'></span>
      <span v-bind:id="idSharedbSocketState" class='socket-state' style='display:none;'></span>
      <!--<span v-bind:id="idCursorsSocketIndicator" class='socket-indicator'></span>
      <span v-bind:id="idCursorsSocketState" class='socket-state'></span>
      <div v-bind:id="idUsersList" style='display:none;'></div>-->
  </div>
  <div>
    <div class='insert-button-box' v-bind:id="idButton">
      <el-button type="" plain class="el-icon-rank" v-on:click='' circle></el-button>
      <!--<el-button type="" plain v-on:click='' circle><i class="ai ai-zotero ai-1x"></i></el-button>
      <el-button type="" plain v-on:click='' circle><svg-icon icon-class='sum'/></el-button>-->
      <el-button type="warning" plain  icon="el-icon-delete" v-on:click='deleteBlock' circle></el-button>
    </div>
    <div class='box'>
    <div v-bind:id="idToolBar">
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
        <span class="ql-formats">
        <button class="ql-blockquote"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="bullet"></button>
        <button class="ql-indent" value="-1"></button>
        <button class="ql-indent" value="+1"></button>
      </span>
        <span class="ql-formats">
        <select class="ql-align"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
        <button class="ql-formula"></button>
        <button v-bind:id="idButtonZotero" style='transform:translate(0, -6px)'>
          <img src='/static/img/zotero-small-icon.png'/>
          <!--<i class="ai ai-zotero ai-1x"></i>-->
        </button>
        <button v-bind:id="idButtonComment" style='margin-left:10px; transform:translate(5px, 0)'>
          <svg-icon icon-class='comment-black'/>
          <!--<i class="ai ai-zotero ai-1x"></i>-->
        </button>
        <button v-bind:id="idButtonHighlight" style='margin-left:10px; transform:translate(5px, 0)'>
          <svg-icon icon-class='underline'/>
          <!--<i class="ai ai-zotero ai-1x"></i>-->
        </button>
        <!--<input  class="ql-input" name="title" type="text"></input>-->
      </span>
    </div>
<!--
      <div style='position: absolute; right:0px; bottom:0px;z-index:1;'>
        <el-button type='danger' size="mini" icon="el-icon-delete" v-on:click='' circle></el-button>
      </div>-->
    <div class='pre' lang='en'>
      <div   v-bind:id="idEditor">
        <span class='p-span' v-html="content"></span>
      </div>
    </div>
  </div>
    <!--<div class='bottom-right'/>-->
    <div class="questions">
      <!--<div class="close-toto"><i class="fa fa-times"></i>
      </div>-->
      <div class="question">
        <div v-bind:id="idInputZotero"  style="display:none;">
          <el-row>
            <el-col :span='2'>
              <img src='/static/img/zotero-small-icon.png'/>
            </el-col>
            <el-col :span='22'>
              <v-autocomplete :items="items" v-model="item" :get-label="getLabel" :component-item="template" @update-items="updateItems">
              </v-autocomplete>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
</div>
</div>

</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Autocomplete from 'v-autocomplete'
Vue.use(Autocomplete)

import ItemTemplate from './ItemTemplate.vue'

import defaultsDeep from 'lodash.defaultsdeep'
import 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill-cursors/dist/quill-cursors.css'
import 'v-autocomplete/dist/v-autocomplete.css'

import hightlightText from '../../utils/js/animation/highlight.js';

var ShareDB = require('sharedb/lib/client')// cursor
var ReconnectingWebSocket = require('reconnectingwebsocket')// cursor
var utils = require('../../utils/js/collaboration/utils')// cursor

var Quill = require('quill');
var uuidv4 = require('uuid/v4');

import QuillCursors from 'quill-cursors/src/cursors';
Quill.register('modules/cursors', QuillCursors);

ShareDB.types.register(require('rich-text').type);
const Embed = Quill.import('blots/embed');
var sharedbWSAddress = ''

if (process.env.NODE_ENV === 'production'){
  sharedbWSAddress = ((window.location.protocol === 'https:') ? 'wss' : 'ws') + '://' + window.location.hostname + '/sharedb'
} else {
  sharedbWSAddress = ((window.location.protocol === 'https:') ? 'wss' : 'ws') + '://' + window.location.hostname + ':4000/sharedb'
}

var shareDBSocket = new ReconnectingWebSocket(sharedbWSAddress);
var shareDBConnection = new ShareDB.Connection(shareDBSocket);

/*Zotero, highlight button in quill toolbar*/
class ProcLink extends Embed {
    static create(value) {
        let node = super.create(value);
        // give it some margin
        node.setAttribute('style', "background-color : #FFDCA6;");
        node.setAttribute('datareview', value.value);
        node.innerHTML = value.text;
        return node;
    }

    static value(node) {
      console.log(node  )
      return {
        value: node.getAttribute('datareview'),
        text: node.innerHTML
      };
    }
}

ProcLink.blotName = 'datareview';
ProcLink.className = 'datareview';
ProcLink.tagName = 'span';

/*Link the new button in quill*/
Quill.register(ProcLink, true);

export default {
  name: 'QuillEditor',
  props: {
    cursors: [Object],
    content: [String],
    uuid: [String],
    numBlock: {},
    numSubBlock: {},
    numSubSubBlock: {},
    output: {
        default : 'delta'
    },
    config: {
        default() {
            return {}
        },
    }
  },
  data() {
    return {
      inputRefVisible: false,
      editor: {},
      idSharedbSocketIndicator: this.setIdSharedbSocketIndicator(),
      idSharedbSocketState: this.setIdSharedbSocketState(),
      idCursorsSocketIndicator: this.setIdCursorsSocketIndicator(),
      idCursorsSocketState: this.setIdCursorsSocketState(),
      idUsersList: this.setIdUsersList(),
      idEditor: this.setIdEditor(),
      idToolBar: this.setIdToolBar(),
      idButton: this.setIdButton(),
      idButtonZotero: this.setIdButtonZotero(),
      idInputZotero: this.setIdInputZotero(),
      idButtonComment: this.setIdButtonComment(),
      idButtonHighlight: this.setIdButtonHighlight(),
      item: {id: 0, name: 'Reference', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
      items: [],
      template: ItemTemplate,
      actionValidate: 0,
      mouse_pos : '',
      hostname: ''
    }
  },
  created() {


  },
  mounted() {

    var quill = window.quill = new Quill('#'+this.idEditor, {
      modules: {
        cursors:  {
          hideDelayMs: 5000,
          hideSpeedMs: 0,
          selectionChangeSource: null
      },
        toolbar: '#'+ this.idToolBar
      },
      history: {
        userOnly: true
      },
      placeholder: 'Compose an epic...',
      theme: 'bubble'  // or 'bubble',

    });

    var doc = shareDBConnection.get('documents', this.idEditor);
    //shareDBConnection.createFetchQuery(collectionName, query, options, callback)
    //shareDBConnection.createSubscribeQuery(collectionName, query, options, callback)

    let self = this

    document.querySelector('#' + this.idButtonZotero).addEventListener('click', function() {
      var range = quill.getSelection(focus = true);
      $("#"+self.idInputZotero).toggle()
      var html_ = '<a href="#" tooltip="" style="color:red">[R1]</a>'
      self.pasteHtmlAtCaret(html_)
    });

    document.querySelector('#' + this.idButtonComment).addEventListener('click', function() {
      self.highlightSelection()
    });

    this.editor = quill

    var cursorsModule = this.editor.getModule('cursors');

    /*this.editor.on('text-change', (delta, oldDelta, source) => {
        this.$emit('edit', this.editor, delta, oldDelta,this.numBlock,this.numSubBlock,this.numSubSubBlock)
    });*/

    //axios.put('/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"arr_content": this.postForm.arr_content,"published": true })

    self = this

    doc.subscribe(function(err) {

      if (err) throw err;

      if (!doc.type) {
        doc.create([{
          insert: '\n'
        }], 'rich-text')
        doc.data = self.content
      }

      // update editor contents
      self.editor.setContents(doc.data);

      // local -> server
      self.editor.on('text-change', function(delta, oldDelta, source) {
        if (source == 'user') {
          self.$emit('edit', self.editor, delta, oldDelta,self.numBlock,self.numSubBlock,self.numSubSubBlock)
          // Check if it's a formatting-only delta
          var formattingDelta = delta.reduce(function (check, op) {
            return (op.insert || op.delete) ? false : check;
          }, true);

          // If it's not a formatting-only delta, collapse local selection
          if (
            !formattingDelta &&
            self.cursors.getLocalConnectionRange() &&
            self.cursors.getLocalConnectionRangeLength()
          ) {
            var _index = self.cursors.getLocalConnectionRangeLength() + 1
            self.cursors.setLocalConnectionRangeIndex(_index)
            self.cursors.setLocalConnectionRangeLength(0)
            self.cursors.update()
          }

          doc.submitOp(delta, {
            source: self.editor
          }, function(err) {
            if (err)
              console.error('Submit OP returned an error:', err);
          });

          /*setInterval(function() {
            self.$emit('signalUpdateUserList', self.cursors)
          },5000)*/
        }
      });

      cursorsModule.registerTextChangeListener();

      // server -> local
      doc.on('op', function(op, source) {
        if (source !== self.editor) {
          self.editor.updateContents(op);
          /*setInterval(function() {
            self.$emit('signalUpdateUserList', self.cursors)
          },5000)*/

        }
      });

      //
      function sendCursorData(range) {
        self.cursors.setLocalConnectionRange(range);
        self.cursors.update();
      }

      //
      var debouncedSendCursorData = utils.debounce(function() {
        var range = self.editor.getSelection();
        if (range) {
          console.log('[cursors] Stopped typing, sending a cursor update/refresh.');
          sendCursorData(range);
        }
      }, 3000);

      doc.on('nothing pending', debouncedSendCursorData);

      function updateCursors(source) {
        var activeConnections = {},
          updateAll = Object.keys(cursorsModule.cursors).length == 0;

        self.cursors.connections.forEach(function(connection) {
          if (connection.id != self.cursors.localConnection.id) {

            // Update cursor that sent the update, source (or update all if we're initting)
            if ((connection.id == source.id || updateAll) && connection.range) {
              cursorsModule.setCursor(
                connection.id,
                connection.range,
                connection.name,
                connection.color
              );
            }

            // Add to active connections hashtable
            activeConnections[connection.id] = connection;
          }
        });

        // Clear 'disconnected' cursors
        Object.keys(cursorsModule.cursors).forEach(function(cursorId) {
          if (!activeConnections[cursorId]) {
            cursorsModule.removeCursor(cursorId);
          }
        });
      }

      self.editor.on('selection-change', function(range, oldRange, source) {
        sendCursorData(range);
      });

      document.addEventListener('cursors-update', function(e) {
        // Handle Removed Connections
        e.detail.removedConnections.forEach(function(connection) {
          if (cursorsModule.cursors[connection.id])
            cursorsModule.removeCursor(connection.id);
        });

        updateCursors(e.detail.source);
        /*setInterval(function() {
          self.$emit('signalUpdateUserList', self.cursors)
        },5000)*/
      })

      updateCursors(self.cursors.localConnection)
      /*setInterval(function() {
        self.$emit('signalUpdateUserList', self.cursors)
      },5000)*/
    })

    window.cursors = this.cursors

    $('#'+this.idButtonZotero).click(function () {
      self.showZoteroMenu(
        $(this));
    });
    $('.close-toto').click(function (e) {
      e.stopPropagation();
      $(this).parent().hide();
      $('.items').removeClass('no-effect');
    });

    $(document).ready(function() {
        $("#"+self.idButton).toggle();
        self.editor.on('selection-change', function(range, oldRange, source) {
        if (range === null && oldRange !== null) {
          // console.log('blur');
          $("#"+self.idButton).toggle()
        } else if (range !== null && oldRange === null)
          // console.log('focus');
          $("#"+self.idButton).toggle()
        });
    });

    $(document).on('contextmenu', '#'+this.idEditor , function(e) {
      e.preventDefault();
      quill.theme.tooltip.edit();
      quill.theme.tooltip.show();
      self.mouse_pos = e
      return false;
    });

    // DEBUG

    var sharedbSocketStateEl = document.getElementById('sharedb-socket-state');
    var sharedbSocketIndicatorEl = document.getElementById('sharedb-socket-indicator');

    shareDBConnection.on('state', function(state, reason) {
      var indicatorColor;

      console.log('[sharedb] New connection state: ' + state + ' Reason: ' + reason);

      sharedbSocketStateEl.innerHTML = state.toString();

      switch (state.toString()) {
        case 'connecting':
          indicatorColor = 'silver';
          break;
        case 'connected':
          indicatorColor = 'lime';
          break;
        case 'disconnected':
        case 'closed':
        case 'stopped':
          indicatorColor = 'red';
          break;
      }

      sharedbSocketIndicatorEl.style.backgroundColor = indicatorColor;
    });

  },
  watch: {
    content (newContent) {
      if (this.content !== this.editor.root.innerHTML) {
        this.editor.root.innerHTML = this.content
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  methods:{
    /*Hightlight Functions*/
    highlightSelection () {
        var userSelection = window.getSelection().getRangeAt(0);
        this.highlightRange();
    },
    highlightRange () {

        var uuid_review = String(uuidv4())

        var range = this.editor.getSelection();

        var selectedText = this.editor.getText(range.index, range.length);
        var cObj = {text : selectedText, value : uuid_review};
        this.editor.deleteText(range.index  , range.length);
        this.editor.insertEmbed(range.index,"datareview",cObj)
        this.$emit('comment', uuid_review)
    },
    showZoteroMenu (button) {
      var offset = this.mouse_pos
      console.log(offset.offsetY)

      $('.questions')
        .fadeIn()
        .css({
          left: Math.min(0, $(window).innerWidth()-$('.questions').outerWidth()),
          top: offset.offsetY + 36
        });
    },
    pasteHtmlAtCaret (html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    },
    getLabel (item) {
      if(item){
        if(this.actionValidate == 1){
          $("#"+this.idInputZotero).toggle()
          $(".questions").toggle()
        }
        this.actionValidate = 1

        return item.name
      }
    },
    updateItems (text) {
        this.items = [{id: 1, name: 'Modulation of longevity and tissue homeostasis by the Drosophila PGC-1 homolog', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
                      {id: 2, name: 'Intestinal barrier dysfunction links metabolic and inflammatory markers of aging to death in Drosophila', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
                      {id: 3, name: 'Parkin overexpression during aging reduces proteotoxicity, alters mitochondrial dynamics, and extends lifespan', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
                      {id: 4, name: 'Distinct shifts in microbiota composition during Drosophila aging impair intestinal function and drive mortality', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
                      {id: 5, name: 'AMPK modulates tissue and organismal aging in a non-cell-autonomous manner', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'}
                    ]
    },
    setIdEditor () {
      return 'editor-container-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdToolBar () {
      return 'toolbar-container-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdButton () {
      return 'bottom-right-button-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdButtonZotero () {
      return 'button-zotero-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdInputZotero () {
      return 'input-zotero-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdButtonComment () {
      return 'button-comment-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdButtonHighlight () {
      return 'button-hightlight-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdSharedbSocketIndicator () {
      return 'id-sharedb-socket-indicator-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdSharedbSocketState () {
      return 'id-sharedb-socket-state-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdCursorsSocketIndicator () {
      return 'id-cursors-socket-indicator-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdCursorsSocketState () {
      return 'id-cursors-socket-state-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    setIdUsersList () {
      return 'id-users-list-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
    },
    deleteBlock () {
      this.$emit('delete',true)
    }
  }
}
</script>
<style>

.ql-input{
  color:black;
  background-color:transparent;
}
/*
.ql-cursor-flag {
  display: none;
}
*/
.pre {
  margin: 0 auto;
  width: 100%;
}

p {
  text-align: justify;

  /*white-space: pre-line;*/
  -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;

}

.insert-button-box{
  width: 0px;
  height: 0px;
  padding: 0px 0px 0px 0px;
  display: block;
  text-align: center;
  z-index:1;


  margin: 0px 0px 0px 0px;
  -webkit-transform: translate(-60px,0);
  -ms-transform: translate(-60px,0px);
  transform: translate(-60px,0px);

}
.insert-button-box .el-button{

}
.insert-button-box .el-button+.el-button {margin-left: 0px}

.bottom-right{
  width: 0px;
  height: 0px;
  border-style: solid;
  border-width: 0 0 20px 20px;
  border-color: transparent transparent #909993 transparent;

}
.box {
  width: 100%;
  height: auto;
  /*margin: 15px auto;*/
  background: transparent;
  position: relative;
  z-index:1000;
}
.box:before {
  position: absolute;
  content: "";
  width: 20px;
  height: 20px;
  top: -1px;
  left: -1px;
  z-index:1000;
  border-left: 1px solid #d9e2dc;
  border-top: 1px solid #d9e2dc;
}
.box:after {
  position: absolute;
  content: "";
  width: 20px;
  height: 20px;
  right: -1px;
  bottom: -1px;
  z-index:1;
  border-right: 1px solid #d9e2dc;
  border-bottom: 1px solid #d9e2dc;
}
.v-autocomplete .v-autocomplete-input-group .v-autocomplete-input {
  font-size: 1.1em;
  color: black;
  padding: 10px 10px;
  box-shadow: none;
  border: 1px solid #222 ;
  width: calc(100% - 32px);
  outline: none;
  background-color: #eee;
}
.v-autocomplete .v-autocomplete-input-group.v-autocomplete-selected .v-autocomplete-input {
  color: black;
  background-color: #eee;
}
.v-autocomplete .v-autocomplete-list {
  width: 100%;
  text-align: left;
  border: none;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  border-bottom: 1px solid #157977;
  color: black;
}
.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item {
  cursor: pointer;
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #157977;
  border-left: 1px solid #157977;
  border-right: 1px solid #157977;
}
.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item:last-child {
  border-bottom: none;
}
.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item:hover {
  background-color: #eee;
}
.v-autocomplete .v-autocomplete-list .v-autocomplete-list-item abbr {
  opacity: 0.8;
  font-size: 0.8em;
  display: block;
  font-family: sans-serif;
}
.questions {
    display: none;
    background: #222;
    position: absolute;
    z-index: 1000;
    color: #EEE;
    border-radius: 6px;

    width: 600px;
    min-height: 54px;
    height:auto;
}
.question {
    position: absolute;
    width: 100%;
    padding: 5px 2px 5px 5px;
    font-size: 16px;
    text-align: center;
}
.question img{
  margin-top: 7px;
}
.question p {
    margin: 0;
    padding: 0;
}
.close-toto {
    font-size:22px;
    cursor: pointer;
    position: absolute;
    right:10px;
    top:5px;
}
</style>

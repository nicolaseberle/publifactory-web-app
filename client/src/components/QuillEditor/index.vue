<template>
	<div>
	<div>
		<div class='insert-button-box' v-bind:id="idButton">
			<el-button type="" plain class="el-icon-caret-top" v-on:click='' circle size='mini'></el-button>
			<el-button type="warning" plain  icon="el-icon-delete" v-on:click='deleteBlock' circle size='mini'></el-button>
			<el-button type="" plain class="el-icon-caret-bottom" v-on:click='' circle size='mini'></el-button>
		</div>
		<div class='box' style='z-index=1000;'>

<!--
			<div style='position: absolute; right:0px; bottom:0px;z-index:1;'>
				<el-button type='danger' size="mini" icon="el-icon-delete" v-on:click='' circle></el-button>
			</div>-->
		<div class='pre' lang='en'>
			<div v-bind:id="idEditor">
				<span class='p-span' v-html="content"></span>
			</div>
		</div>


	</div>
	<div v-bind:id="idToolBar"  style='z-index=1000;'>
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
			<!--<input  class="ql-input" name="title" type="text"></input>-->
		</span>
	</div>
		<!--<div class='bottom-right'/>-->
		<div class='questions' v-bind:id="idZotero">
			<!--<div class="close-toto"><i class="fa fa-times"></i>
			</div>-->
			<div class="question" style='z-index=2000;'>
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
	import ItemTemplate from './ItemTemplate.vue'
	import 'quill'
	import 'quill/dist/quill.core.css'

	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import 'v-autocomplete/dist/v-autocomplete.css'
	import axios from 'axios';
	const io = require('socket.io-client');

	Vue.use(Autocomplete)

	import * as Y from 'yjs/dist/yjs.js'
	import { WebsocketProvider } from 'y-websocket'
	import { QuillBinding } from 'y-quill'
	import QuillCursors from 'quill-cursors'

	//var ShareDB = require('sharedb/lib/client')// cursor
	// var ReconnectingWebSocket = require('reconnectingwebsocket')// cursor
	// var utils = require('../../utils/js/collaboration/utils')// cursor

	var Quill = require('quill');
	var uuidv4 = require('uuid/v4');
	Quill.register('modules/cursors', QuillCursors);

	//ShareDB.types.register(require('rich-text').type);

	const debug = require('debug')('frontend');

	const InlineBlot = Quill.import('blots/inline');


	/*Zotero, highlight button in quill toolbar*/
	class ProcLink extends InlineBlot {
			static create(value) {
					let node = super.create(value);
					// give it some margin
					node.setAttribute('style', "background-color : #FFDCA6;");
					node.setAttribute('datareview', value.value);
					node.innerHTML = value.text;
					return node;
			}

			static value(node) {
				return {
					value: node.getAttribute('datareview'),
					text: node.innerHTML
				};
			}
	}

	ProcLink.blotName = 'datareview';
	ProcLink.className = 'datareview';
	ProcLink.tagName = 'span';




	class ProcRef extends InlineBlot {
	    static create(value) {
	        let node = super.create(value);
	        // give it some margin
					node.setAttribute('href', value);
					node.setAttribute('target', '_blank');
	        node.innerHTML = value.text;
	        return node;
	    }
	}

	ProcRef.blotName = 'ref';
	ProcRef.className = 'ref';
	ProcRef.tagName = 'a';

	/*Link the new button in quill*/

	Quill.register(ProcLink, true);
	Quill.register(ProcRef, true);



export default {
	name: 'QuillEditor',
	props: {
	  socket: Object,
		content: {
			type: String
		},
		uuid: {
			type: String,
			default: 'abstract'
		},
		numBlock: {
			type: Number,
			default: 0
		},
		numSubBlock: {
			type: Number,
			default: 0
		},
		numSubSubBlock: {
			type: Number,
			default: 0
		},
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
			id: '',
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
			idZotero : this.setIdZotero(),
			idInputZotero: this.setIdInputZotero(),
			idButtonComment: this.setIdButtonComment(),
			idButtonHighlight: this.setIdButtonHighlight(),
			item: {id: 0, name: 'Reference', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
			items: [],
			template: ItemTemplate,
			actionValidate: 0,
			mouse_pos : '',
			hostname: '',
			timeoutId : '',


			cursor: {
				id: '',
				name: '',
				color: '',
				range: {}
			},
			cursorModule: {},
			binding : {},
			ydoc: {},
			provider : {},
			type: {}

		}
	},
	created() {
		this.id = this.$route.params && this.$route.params.id

	},
	async mounted() {
		/*
      this.socket.on('QUILL_EXEC_TEXT', data => {
          if (this.sameBlock(data))
              this.editor.updateContents(data.delta);
      });
      this.socket.on('QUILL_EXEC_SELECT', data => {
          if (this.sameBlock(data))
              this.cursorModule.moveCursor(this.cursor.id, data.range);
      });
			*/
      /*
			this.socket.on('QUILL_EXEC_USER', data => {
				if (this.sameBlock(data)) {
						for (let i = 0, len = this.mapCursor.length; i < len; ++i)
								if (data.cursor.id === this.mapCursor[i].id)
										return;
						this.mapCursor.push(data.cursor);
						this.socket.emit('QUILL_NEW_USER', {
								cursor: this.cursor
						});
				}
			});
			*/
			/*
			if (process.env.NODE_ENV === 'production'){
				sharedbWSAddress = ((window.location.protocol === 'https:') ? 'wss' : 'ws') + '://' + window.location.hostname + '/mevn-dev'
			} else {
				sharedbWSAddress = ((window.location.protocol === 'https:') ? 'wss' : 'ws') + '://' + window.location.hostname + ':4000/mevn-dev'
			}*/

			this.ydoc = new Y.Doc()
		  this.provider = new WebsocketProvider(((window.location.protocol === 'https:') ? 'wss' : 'ws') + '://' + window.location.hostname + ':4000', 'quill', this.ydoc)
		  this.type = this.ydoc.getText('quill')

			this.editor = new Quill('#' + this.idEditor, {
	        modules: {
						formula: true,
            cursors: true,
            toolbar: '#' + this.idToolBar
	        },
	        history: {
	        	userOnly: true
	        },
	        placeholder: this.content,
	        theme: 'snow',  // or 'bubble',
					bounds: '#' + this.idEditor
	    });

		  /*
		  // Define user name and user name
		  // Check the quill-cursors package on how to change the way cursors are rendered
		  provider.awareness.setLocalStateField('user', {
		    name: 'Typing Jimmy',
		    color: 'blue'
		  })
		  */


	    document.querySelector('#' + this.idButtonZotero).addEventListener('click', () => {
	      var range = this.editor.getSelection(focus = true);
	      $("#"+this.idInputZotero).toggle()
	      //var html_ = '<a href="#" style="color:red">[R'+ this.nbReferences +']</a>'
	      //var html_ =  '<button-ref>R</button-ref>'
	      //quill.clipboard.dangerouslyPasteHTML(range.index, "<button-ref>R1</button-ref>", "api");
	      var uuid_ref = String(uuidv4())

	      var range = this.editor.getSelection();

	      //var selectedText = this.editor.getText(range.index, range.length);
	      var cObj = {text : "[R1]", value : uuid_ref};
	      //this.editor.deleteText(range.index  , range.length);
	      this.editor.insertEmbed(range.index,"ref",cObj)

	      //this.insertStar()
	      //this.pasteHtmlAtCaret(html_)
	    });

	    document.querySelector('#' + this.idButtonComment).addEventListener('click', () => {
	      this.highlightSelection()
	    });

      this.cursorModule = this.editor.getModule('cursors');
      this.cursor = this.cursorModule.createCursor(`${this.idUser}-${this.uuid}`, await this.getUserName(), this.chooseColors());
      this.socket.emit('QUILL_NEW_USER', {
          cursor: this.cursor
      });

      this.editor.on('text-change', (delta, oldDelta, source) => {
          if (this.timeoutId) clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout(async () => {
              await this.$emit('edit', this.editor, delta, oldDelta, this.numBlock, this.numSubBlock, this.numSubSubBlock)
              /*this.socket.emit('QUILL_NEW_TEXT', {
                  editor: this.editor,
                  delta: delta,
                  oldDelta: oldDelta,
                  numBlock: this.numBlock,
                  numSubBlock: this.numSubBlock,
                  numSubSubBlock: this.numSubSubBlock
              })*/
          }, 500);
      });
      this.editor.on('selection-change', range => {
          this.socket.emit('QUILL_NEW_SELECT', {
              range: range,
              numBlock: this.numBlock,
              numSubBlock: this.numSubBlock,
              numSubSubBlock: this.numSubSubBlock
          })
      });

    	this.editor.root.innerHTML = this.content

			this.binding = new QuillBinding(this.type, this.editor, this.provider.awareness)

			window.cursors = this.cursors

	    $('#'+this.idButtonZotero).click( () => {
	      this.showZoteroMenu(
	        $(this));
	    });
	    $('.close-toto').click( (e) => {
	      e.stopPropagation();
	      $(this).parent().hide();
	      $('.items').removeClass('no-effect');
	    });

	    $(document).ready(() => {
	        $("#"+this.idButton).toggle();
					$("#"+this.idToolBar).toggle();
	        this.editor.on('selection-change', (range, oldRange, source) => {
	        if (range === null && oldRange !== null) {
	          $("#"+this.idButton).toggle()
						$("#"+this.idToolBar).toggle()
	        } else if (range !== null && oldRange === null){
	          	$("#"+this.idButton).toggle()
							$("#"+this.idToolBar).toggle()
						}
	        });
	    });

	    /*
			$(document).on('contextmenu', '#'+this.idEditor , (e) => {
	      e.preventDefault();
	      this.editor.theme.tooltip.edit();
	      this.editor.theme.tooltip.show();
	      this.mouse_pos = e
	      return false;
	    });
			*/
  },
	watch: {
		content (newContent) {
			if (this.content !== this.editor.root.innerHTML) {
				this.editor.root.innerHTML = newContent
			}
		}
	},
  computed: {
    ...mapGetters(['userId', 'accessToken'])
  },
	methods:{
	  async getUserName () {
	    return new Promise(resolve => {
          axios.get('/api/users/me',
            {headers: {'Authorization': `Bearer ${this.accessToken}`}}).then(response => {
              const user = response.data;
              resolve(`${user.firstname[0].toUpperCase()}. ${user.lastname.toUpperCase()}`);
					});
			});
		},
	  sameBlock (json) {
	    return json.numBlock === this.numBlock && json.numSubBlock === this.numSubBlock &&
				json.numSubSubBlock === this.numSubSubBlock;
		},
		chooseColors () {
			const allColors = [
					"#05a3d5",
					"#05160e",
					"#22f2d3",
					"#5e5da0",
					"#b3111c",
					"#4aea2e",
					"#94e61f",
					"#e00cf1",
					"#6019c2",
					"#2a8c2d",
					"#9643cf",
					"#29beb1",
					"#f62c6b",
					"#a3ac87",
					"#556dbb",
					"#f42916"
			];
			return allColors[Math.floor(Math.random() * Math.floor(16))];
		},
		sendUpdates () {
			this.socket.emit('UPDATE_SECTION', {
				content: this.content,
				numBlock: this.numBlock,
				numSubBlock: this.numSubBlock,
				numSubSubBlock: this.numSubSubBlock
			})
		},
    insertStar() {
      const cursorPosition = this.editor.getSelection().index;
      // this.editor.insertText(cursorPosition, "★");

      // var bufferText = $("#" + this.idEditor).html().replace(/<em class="my-icon">/g, "").replace(/<\/em>/g, "");

      // var tmpOut = bufferText.replace(/★/g, "<button>R1</button>");

      // $("#" + this.idEditor).html(tmpOut);

      this.editor.clipboard.dangerouslyPasteHTML(cursorPosition, "<button>R1</button>", "api");
      this.editor.setSelection(cursorPosition + 2);
    },
    sendUpdates () {
      this.socket.emit('UPDATE_SECTION', {
        content: this.content,
        numBlock: this.numBlock,
        numSubBlock: this.numSubBlock,
        numSubSubBlock: this.numSubSubBlock
      })
    },


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
			debug(offset.offsetY)

			$("#"+this.idZotero)
				.fadeIn()
				.css({
					left: Math.min(0, $(window).innerWidth()-$("#"+this.idZotero).outerWidth()),
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
					$("#"+this.idZotero).toggle()
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
		setIdTooltip () {
			return 'toolbar-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
		},
		setIdZotero () {
			return 'zotero-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
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
		},


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
	float: right;

	margin: 0px 0px 0px 0px;
	-webkit-transform: translate(10px,0);
	-ms-transform: translate(10px,0px);
	transform: translate(10px,0px);

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
button-ref{
    background-color: Transparent;
    background-repeat:no-repeat;
    border: 1px solid black;
    margin-left:5px;
    margin-right: 5px;
    cursor:pointer;
    overflow: hidden;
    outline:none;
}

.ql-container.ql-snow{
	border: none;
	display: hidden;
}
</style>

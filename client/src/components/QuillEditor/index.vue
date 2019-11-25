<template>
	<div>
		<div>
			<div class="insert-button-box" v-bind:id="idButton">
				<el-button
					type
					plain
					class="el-icon-caret-top"
					circle
					size="mini"
				></el-button>
				<el-button
					type="warning"
					plain
					icon="el-icon-delete"
					v-on:click="deleteBlock"
					circle
					size="mini"
				></el-button>
				<el-button
					type
					plain
					class="el-icon-caret-bottom"
					circle
					size="mini"
				></el-button>
			</div>
			<div class="box" style="z-index=1000;">
				<!--
			<div style='position: absolute; right:0px; bottom:0px;z-index:1;'>
				<el-button type='danger' size="mini" icon="el-icon-delete" v-on:click='' circle></el-button>
        </div>-->
				<div class="pre" lang="en">
					<div v-bind:id="idEditor">
						<span class="p-span" v-html="content"></span>
					</div>
				</div>
			</div>
			<div v-bind:id="idToolBar" style="z-index=1000;">
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
					<button
						class="citation-icon-btn"
						v-bind:id="idButtonZotero"
						v-on:click="toggleCitation"
					>
						Citations
					</button>
					<button v-bind:id="idButtonComment">
						<svg-icon icon-class="comment-black" />
					</button>
				</span>
			</div>
			<div class="questions" v-show="showCitation" v-bind:id="idZotero">
				<div class="question" v-show="showCitation" style="z-index=2000;">
					<div v-show="showCitation" v-bind:id="idInputZotero">
						<el-row>
							<el-col class="loader-container" :span="2">
								<div v-show="toggleLoaderQueryCitation" class="lds-ring">
									<div></div>
									<div></div>
									<div></div>
									<div></div>
								</div>
								<!-- <img src="/static/img/zotero-small-icon.png" /> -->
							</el-col>
							<el-col class="question-span" :span="22">
								<v-autocomplete
									:items="items"
									:get-label="getLabel"
									:component-item="template"
									@update-items="updateItems"
									@item-clicked="addReference"
									:wait="400"
									:min-len="2"
								></v-autocomplete>
							</el-col>
						</el-row>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import Autocomplete from 'v-autocomplete';
import ItemTemplate from './ItemTemplate.vue';
import 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'v-autocomplete/dist/v-autocomplete.css';
import QuillCursors from 'quill-cursors';
import axios from 'axios';
import collaboration from './collaboration';
import richText from 'rich-text';

const io = require('socket.io-client');

Vue.use(Autocomplete);

var Quill = require('quill');
var uuidv4 = require('uuid/v4');
Quill.register('modules/cursors', QuillCursors);

const debug = require('debug')('frontend');

const InlineBlot = Quill.import('blots/inline');
const Embed = Quill.import('blots/embed');
// import Parchment from 'parchment';

/*Zotero, highlight button in quill toolbar*/
class ProcLink extends InlineBlot {
	static create(value) {
		let node = super.create(value);
		// give it some margin
		node.setAttribute('style', 'background-color : #FFDCA6;');
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

class Citation extends Embed {
	static create(value) {
		const node = super.create(value);
		node.innerHTML = value.text;
		node.setAttribute('href', value.href);
		node.setAttribute('style', 'font-size: 0.8rem;');
		node.addEventListener('click', () => {
			node.scrollIntoView();
		});
		return node;
	}

	format(name, value) {
		super.format(name, value);
	}

	static formats(domNode) {
		return domNode.getAttribute('href');
	}

	static value(node) {
		return {
			href: node.getAttribute('href'),
			text: node.textContent
		};
	}
	// Parent Func
	// update(mutations, context) {}
	// format(name, value) {
	//   // this.domNode.setAttribute('href', value.href);
	// }
	deleteAt(index, length) {
		// Parchment.Container.proptype.deleteAt.call(this, index, length);
		super.deleteAt(index, length);
	}

	formatAt(index, length, format, value) {
		super.formatAt(index, length, format, value);
	}
	// insertAt(index, text) {}

	update(mutations, context) {
		super.update(mutations, context);
	}
	// optimize(context) {}
}

Citation.blotName = 'citation';
Citation.className = 'citation';
Citation.tagName = 'a';

class ProcRef extends InlineBlot {
	static create(value) {
		let node = super.create(value);
		node.setAttribute('href', value.href);
		// node.setAttribute('target', '_blank');
		node.innerHTML = value.text + ' ';
		return node;
	}
}

ProcRef.blotName = 'ref';
ProcRef.className = 'test';
ProcRef.tagName = 'a';

/*Link the new button in quill*/

Quill.register(ProcLink, true);
Quill.register(ProcRef, true);
Quill.register(Citation, true);

export default {
	name: 'QuillEditor',
	props: {
		wssdb: Object,
		socket: Object,
		content: {
			type: String | Array | Object
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
			default: 'delta'
		},
		config: {
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			cursorId: null, // === userName
			shareDoc: null,
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
			idZotero: this.setIdZotero(),
			idInputZotero: this.setIdInputZotero(),
			idButtonComment: this.setIdButtonComment(),
			idButtonHighlight: this.setIdButtonHighlight(),
			item: {
				id: 0,
				name: '',
				description: ''
			},
			items: [],
			template: ItemTemplate,
			actionValidate: 0,
			mouse_pos: '',
			hostname: '',
			timeout: 600,
			cursor: {
				id: '',
				name: '',
				color: '',
				range: {}
			},
			cursorModule: {},
			lastRange: {},
			updateLocalCursorIntervalId: null,
			showCitation: false,
			toggleLoaderQueryCitation: false,
			isCitationToggled: false,
			citationRange: {}
		};
	},
	beforeDestroy() {
		clearInterval(this.updateLocalCursorIntervalId);
		if (!this.shareDoc) return;
		this.shareDoc.removeListener('op', () => {});
		this.shareDoc.destroy();
		this.shareDoc = null;
	},
	async created() {
		this.cursorId = await this.getUserName();
		this.id = this.$route.params && this.$route.params.id;
	},
	async destroyed() {
		this.socket.emit('REMOVE_QUILL_SELECT', {
			cursorId: await this.getUserName()
		});
	},

	mounted() {
		if (this.shareDoc === null) {
			const connection = this.wssdb.getConnection();
			this.shareDoc = connection.get(
				'collaboration',
				`${this.numBlock}${this.numSubBlock}${this.numSubSubBlock}`
			);
		}
		if (this.shareDoc.type === null) {
			this.shareDoc.create([{ insert: '' }], richText.type.name);
		}
		this.shareDoc.subscribe(err => {
			if (err) console.warn('SHAREDB', err);
			if (this.shareDoc.type === null) {
				console.warn('DOC NOT CREATED');
			}
		});

		this.shareDoc.on('op', (op, source) => {
			if (source === this.editor) return;
			this.editor.updateContents(op, 'api');
		});

		this.socket.on('QUILL_EXEC_SELECT', data => {
			collaboration.selectionUpdate(this, data);
		});

		this.socket.on('DELETE_CURSOR', data => {
			if (!this.sameBlock(data)) return;
			this.cursorModule.removeCursor(data.cursorId);
		});

		this.socket.on('QUILL_RESP_SELECT', data => {
			collaboration.selectionUpdate(this, data);
			const selection = this.editor.getSelection();
			if (!selection) return;
			this.socket.emit('QUILL_NEW_SELECT', {
				range: selection,
				numBlock: this.numBlock,
				numSubBlock: this.numSubBlock,
				numSubSubBlock: this.numSubSubBlock,
				cursorId: this.cursorId
			});
		});

		var quill = new Quill('#' + this.idEditor, {
			modules: {
				formula: true,
				cursors: {
					hideDelayMs: 5000,
					hideSpeedMs: 0,
					selectionChangeSource: null
				},
				toolbar: '#' + this.idToolBar
			},
			history: {
				userOnly: true
			},
			placeholder: this.content,
			theme: 'snow', // or 'bubble',
			bounds: '#' + this.idEditor
		});
		this.editor = quill;

		document
			.querySelector('#' + this.idButtonComment)
			.addEventListener('click', () => {
				this.highlightSelection();
			});

		this.cursorModule = this.editor.getModule('cursors');
		this.socket.emit('QUILL_NEW_USER', {
			cursor: this.cursor
		});

		this.editor.on('text-change', (delta, oldDelta, source) => {
			if (source === 'api') {
				return;
			}

			if (delta.filter(op => op.delete).length !== 0) {
				const citationsDeleted = oldDelta.reduce((acc, op) => {
					if (op.insert && op.insert.citation) {
						const element = document.querySelectorAll(
							`a[href^='${op.insert.citation.href}']`
						)[0];
						if (!element) {
							return [...acc, op.insert.citation];
						}
					}
					return acc;
				}, []);
				if (citationsDeleted.length !== 0) {
					quill - delta;
					this.$emit('deleteReference');
				}
			}
			this.shareDoc.submitOp(delta, { source: this.editor }, err => {
				if (err && err.code === 4015) {
					console.warn(err);
				}
			});
			collaboration.textCommit(this, delta);
			const selection = this.editor.getSelection();
			if (!selection) return;
			this.socket.emit('QUILL_REQ_UPDATE', {
				range: selection,
				numBlock: this.numBlock,
				numSubBlock: this.numSubBlock,
				numSubSubBlock: this.numSubSubBlock,
				cursorId: this.cursorId
			});
			// collaboration.updateForeignCursors(this, delta)
		});

		this.editor.on('selection-change', (range, oldRange, source) => {
			if (source === 'api') return;
			if (source === 'user' && range === null) {
				// Lose focus on this editor
				// if (!this.isCitationToggled) this.showCitation = false;
				collaboration.cursorRemove(this);
				return;
			}
			this.lastRange = range;
			collaboration.selectionCommit(this, range);
		});

		this.editor.root.innerHTML = this.content;

		window.cursors = this.cursors;

		$(document).ready(() => {
			$('#' + this.idButton).toggle();
			$('#' + this.idToolBar).toggle();
			this.editor.on('selection-change', (range, oldRange, source) => {
				if (range === null && oldRange !== null) {
					$('#' + this.idButton).toggle();
					$('#' + this.idToolBar).toggle();
				} else if (range !== null && oldRange === null) {
					$('#' + this.idButton).toggle();
					$('#' + this.idToolBar).toggle();
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
	computed: {
		...mapGetters(['userId', 'accessToken'])
	},
	methods: {
		toggleCitation() {
			this.showCitation = !this.showCitation;
			this.citationRange = this.editor.getSelection();
			// if (this.showCitation) {
			//   this.isCitationToggled = true;
			// }
		},
		async getUserName() {
			return new Promise(resolve => {
				axios
					.get('/api/users/me', {
						headers: { Authorization: `Bearer ${this.accessToken}` }
					})
					.then(response => {
						const user = response.data;
						resolve(
							`${user.firstname[0].toUpperCase()}. ${user.lastname.toUpperCase()}`
						);
					});
			});
		},
		sameBlock(json) {
			return (
				json.numBlock === this.numBlock &&
				json.numSubBlock === this.numSubBlock &&
				json.numSubSubBlock === this.numSubSubBlock
			);
		},
		chooseColors() {
			const allColors = [
				'#05a3d5',
				'#05160e',
				'#22f2d3',
				'#5e5da0',
				'#b3111c',
				'#4aea2e',
				'#94e61f',
				'#e00cf1',
				'#6019c2',
				'#2a8c2d',
				'#9643cf',
				'#29beb1',
				'#f62c6b',
				'#a3ac87',
				'#556dbb',
				'#f42916'
			];
			return allColors[Math.floor(Math.random() * Math.floor(16))];
		},
		insertStar() {
			const cursorPosition = this.editor.getSelection().index;
			// this.editor.insertText(cursorPosition, "★");

			// var bufferText = $("#" + this.idEditor).html().replace(/<em class="my-icon">/g, "").replace(/<\/em>/g, "");

			// var tmpOut = bufferText.replace(/★/g, "<button>R1</button>");

			// $("#" + this.idEditor).html(tmpOut);

			this.editor.clipboard.dangerouslyPasteHTML(
				cursorPosition,
				'<button>R1</button>',
				'api'
			);
			// this.editor.setSelection(cursorPosition + 2);
		},

		/*Hightlight Functions*/
		highlightSelection() {
			var userSelection = window.getSelection().getRangeAt(0);
			this.highlightRange();
		},
		highlightRange() {
			var uuid_review = String(uuidv4());

			var range = this.editor.getSelection();

			var selectedText = this.editor.getText(range.index, range.length);
			var cObj = { text: selectedText, value: uuid_review };
			this.editor.deleteText(range.index, range.length);
			this.editor.insertEmbed(range.index, 'datareview', cObj);
			this.$emit('comment', uuid_review);
		},
		pasteHtmlAtCaret(html) {
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
					var el = document.createElement('div');
					el.innerHTML = html;
					var frag = document.createDocumentFragment(),
						node,
						lastNode;
					while ((node = el.firstChild)) {
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
			} else if (document.selection && document.selection.type != 'Control') {
				// IE < 9
				document.selection.createRange().pasteHTML(html);
			}
		},
		getLabel(item) {
			if (item) {
				if (this.actionValidate == 1) {
					$('#' + this.idInputZotero).toggle();
					$('#' + this.idZotero).toggle();
				}
				this.actionValidate = 1;

				return item.name;
			}
		},
		addReference(item) {
			const block = `${this.numBlock}${this.numSubBlock}${this.numSubSubBlock}${this.citationRange.index}`;
			const id = `${uuidv4()}`;
			const reference = {
				...item,
				block,
				id,
				ref: `#reference-${id}-${block}`
			};

			this.$emit(
				'addReference',
				this.editor,
				this.citationRange.index,
				reference
			);
			this.socket.emit('NEW_REFERENCE', reference);
		},
		async updateItems(text) {
			this.toggleLoaderQueryCitation = !this.toggleLoaderQueryCitation;
			const response = await axios.get(
				'https://service.publifactory.co/api/sync_ref',
				{
					params: {
						title: text
					}
				}
			);
			this.toggleLoaderQueryCitation = !this.toggleLoaderQueryCitation;
			if (response.data === '' || response.data.length === 0) {
				this.items = [];
				return;
			}
			this.items = response.data.map((article, id) => {
				return { id, name: article.title, description: '' };
			});
		},
		setIdEditor() {
			return (
				'editor-container-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdToolBar() {
			return (
				'toolbar-container-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdButton() {
			return (
				'bottom-right-button-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdTooltip() {
			return (
				'toolbar-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdZotero() {
			return (
				'zotero-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdButtonZotero() {
			return (
				'button-zotero-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdInputZotero() {
			return (
				'input-zotero-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdButtonComment() {
			return (
				'button-comment-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdButtonHighlight() {
			return (
				'button-hightlight-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdSharedbSocketIndicator() {
			return (
				'id-sharedb-socket-indicator-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdSharedbSocketState() {
			return (
				'id-sharedb-socket-state-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdCursorsSocketIndicator() {
			return (
				'id-cursors-socket-indicator-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdCursorsSocketState() {
			return (
				'id-cursors-socket-state-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		setIdUsersList() {
			return (
				'id-users-list-' +
				this.uuid +
				'-' +
				this.numBlock +
				'-' +
				this.numSubBlock +
				'-' +
				this.numSubSubBlock
			);
		},
		deleteBlock() {
			this.$emit('delete', true);
		}
	}
};
</script>
<style>
.ql-input {
	color: black;
	background-color: transparent;
}

.ql-cursor-flag {
	/* margin-top: 4px; */
}

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

.insert-button-box {
	width: 0px;
	height: 0px;
	padding: 0px 0px 0px 0px;
	display: block;
	text-align: center;
	z-index: 1;
	float: right;

	margin: 0px 0px 0px 0px;
	-webkit-transform: translate(10px, 0);
	-ms-transform: translate(10px, 0px);
	transform: translate(10px, 0px);
}
.insert-button-box .el-button {
}
.insert-button-box .el-button + .el-button {
	margin-left: 0px;
}

.bottom-right {
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
	z-index: 1000;
}
.box:before {
	position: absolute;
	content: '';
	width: 20px;
	height: 20px;
	top: -1px;
	left: -1px;
	z-index: 1000;
	border-left: 1px solid #d9e2dc;
	border-top: 1px solid #d9e2dc;
}
.box:after {
	position: absolute;
	content: '';
	width: 20px;
	height: 20px;
	right: -1px;
	bottom: -1px;
	z-index: 1;
	border-right: 1px solid #d9e2dc;
	border-bottom: 1px solid #d9e2dc;
}
.v-autocomplete .v-autocomplete-input-group .v-autocomplete-input {
	font-size: 1.1em;
	color: black;
	padding: 10px 10px;
	box-shadow: none;
	border: 1px solid #222;
	border-radius: 6px;
	width: calc(100% - 32px);
	outline: none;
	background-color: #eee;
}
.v-autocomplete
	.v-autocomplete-input-group.v-autocomplete-selected
	.v-autocomplete-input {
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

.citation-icon-btn {
	width: auto !important;
	line-height: 0;
}

.citation-icon-btn:focus {
	outline: none;
}

.loader-container {
	padding-left: 4px;
}

.questions {
	/* display: none; */
	padding-bottom: 60px;
	background: #222;
	position: absolute;
	z-index: 1000;
	color: #eee;
	border-radius: 6px;

	width: 600px;
	min-height: 54px;
	height: auto;
}
.question {
	position: absolute;
	width: 100%;
	padding: 5px 2px 5px 5px;
	font-size: 16px;
	text-align: center;
}
.question img {
	margin-top: 7px;
}
.question p {
	margin: 0;
	padding: 0;
}
.question-span {
	padding-top: 3px;
	float: right;
}
.close-toto {
	font-size: 22px;
	cursor: pointer;
	position: absolute;
	right: 10px;
	top: 5px;
}
button-ref {
	background-color: Transparent;
	background-repeat: no-repeat;
	border: 1px solid black;
	margin-left: 5px;
	margin-right: 5px;
	cursor: pointer;
	overflow: hidden;
	outline: none;
}

.ql-container.ql-snow {
	border: none;
	display: hidden;
}
.lds-ring {
	display: inline-block;
	position: relative;
	width: 100px;
	height: 100px;
}
.lds-ring div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: 32px;
	height: 32px;
	margin: 8px;
	border: 8px solid #fff;
	border-radius: 50%;
	animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
	animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
	animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
	animation-delay: -0.15s;
}
@keyframes lds-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>

<template>
  <div>
    <div v-bind:id="idToolBar">
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
        <button class="ql-strike"></button>
      </span>
        <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
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
        <button class="ql-image"></button>
        <button class="ql-video"></button>
        <button class="ql-formula"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    </div>
  <div v-bind:id="idEditor"><span v-html="content"></span></div>
</div>

</template>

<script>
import defaultsDeep from 'lodash.defaultsdeep'
import 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

var Quill = require('quill');
var Font = Quill.import('formats/font');
Font.whitelist = ['roboto'];
Quill.register(Font, true);

export default {
  name: 'QuillEditor',
  props: {
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
      editor: {},
      idEditor: this.setIdEditor(),
      idToolBar: this.setIdToolBar()
    }
  },
  created() {


  },
  mounted() {
    var quill = new Quill('#'+this.idEditor, {
      modules: {
        toolbar: '#'+ this.idToolBar
      },
      placeholder: 'Compose an epic...',
      theme: 'bubble'  // or 'bubble'
    });
    this.editor = quill
    this.editor.on('text-change', (delta, source) => {
        this.$emit('edit', this.editor, delta, source,this.numBlock,this.numSubBlock,this.numSubSubBlock)
    });
    $(document).on('contextmenu', '#'+this.idEditor , function(e) {
      e.preventDefault();
      quill.theme.tooltip.edit();
      quill.theme.tooltip.show();
      return false;
    });
  },
  watch: {
    content (newContent) {
      if (this.content !== this.editor.root.innerHTML) {
        console.log("il faut mettre à jour la fenetre")
        this.editor.root.innerHTML = this.content
      }
    }
  },
  methods:{
    setIdEditor () {
      if(this.uuid==''){
        return 'editor-container-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock  ;
      }
      else{
        return 'editor-container-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
      }
    },
    setIdToolBar () {
      if(this.uuid==''){
        return 'toolbar-container-' + this.numBlock + '-' + this.numSubBlock+ '-' + this.numSubSubBlock  ;
      }
      else{
        return 'toolbar-container-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
      }
    }
  }
}
</script>

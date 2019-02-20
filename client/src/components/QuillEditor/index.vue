<template>
  <div>
    <div class='insert-button-box' v-bind:id="idButton">
      <el-button type="" plain class="el-icon-rank" v-on:click='' circle></el-button>
      <el-button type="" plain  icon="el-icon-delete" v-on:click='deleteBlock' circle></el-button>
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
        <button class="ql-image"></button>
        <button class="ql-video"></button>
        <button class="ql-formula"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    </div>
<!--
      <div style='position: absolute; right:0px; bottom:0px;z-index:1;'>
        <el-button type='danger' size="mini" icon="el-icon-delete" v-on:click='' circle></el-button>
      </div>-->

    <div class='pre' lang='en'>

      <div   v-bind:id="idEditor">

        <span  v-html="content"></span>


      </div>




      </div>
  </div>
    <!--<div class='bottom-right'/>-->

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
      idToolBar: this.setIdToolBar(),
      idButton: this.setIdButton()
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
      theme: 'bubble'  // or 'bubble',

    });
    this.editor = quill
    this.editor.on('text-change', (delta, source) => {
        this.$emit('edit', this.editor, delta, source,this.numBlock,this.numSubBlock,this.numSubSubBlock)

    });

    let self = this
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
    },
    setIdButton () {
      if(this.uuid==''){
        return 'bottom-right-button-' + this.numBlock + '-' + this.numSubBlock+ '-' + this.numSubSubBlock  ;
      }
      else{
        return 'bottom-right-button-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
      }
    },
    deleteBlock () {
      this.$emit('delete',true)
    }
  }
}
</script>
<style>

.pre {
  margin: 0 auto;
  width: 100%;
}
p {
  text-align: justify;
  white-space: pre-line;

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
}
.box:before {
  position: absolute;
  content: "";
  width: 20px;
  height: 20px;
  top: -1px;
  left: -1px;
  z-index:1;
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
</style>

<template>
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
        <button v-bind:id="idButtonZotero" style='line-height:20px'><i class="ai ai-zotero ai-1x"></i></button>
        <!--<input  class="ql-input" name="title" type="text"></input>-->
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
      <v-autocomplete v-bind:id="idInputZotero" style='display:none' :items="items" v-model="item" :get-label="getLabel" :component-item='template' @update-items="updateItems">
      </v-autocomplete>
  </div>
    <!--<div class='bottom-right'/>-->

</div>

</template>

<script>
import Vue from 'vue'
import Autocomplete from 'v-autocomplete'
Vue.use(Autocomplete)

import ItemTemplate from './ItemTemplate.vue'

import defaultsDeep from 'lodash.defaultsdeep'
import 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'v-autocomplete/dist/v-autocomplete.css'



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
      inputRefVisible: false,
      editor: {},
      idEditor: this.setIdEditor(),
      idToolBar: this.setIdToolBar(),
      idButton: this.setIdButton(),
      idButtonZotero: this.setIdButtonZotero(),
      idInputZotero: this.setIdInputZotero(),
      item: {id: 9, name: 'Lion', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'},
      items: [],
      template: ItemTemplate
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
    document.querySelector('#' + this.idButtonZotero).addEventListener('click', function() {
      var range = quill.getSelection(focus = true);
      this.inputRefVisible = true
      $("#"+self.idInputZotero).toggle()
      //quill.insertText(range.index, "AAAAA");
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
    getLabel (item) {
      return item.name
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
    setIdButtonZotero () {
      if(this.uuid==''){
        return 'button-zotero-' + this.numBlock + '-' + this.numSubBlock+ '-' + this.numSubSubBlock  ;
      }
      else{
        return 'button-zotero-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
      }
    },
    setIdInputZotero () {
      if(this.uuid==''){
        return 'input-zotero-' + this.numBlock + '-' + this.numSubBlock+ '-' + this.numSubSubBlock  ;
      }
      else{
        return 'input-zotero-' + this.uuid + '-' + this.numBlock + '-' + this.numSubBlock + '-' + this.numSubSubBlock ;
      }
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
}

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
  font-size: 1.5em;
  padding: 10px 15px;
  box-shadow: none;
  border: 1px solid #157977;
  width: calc(100% - 32px);
  outline: none;
  background-color: #eee;
}
.v-autocomplete .v-autocomplete-input-group.v-autocomplete-selected .v-autocomplete-input {
  color: #008000;
  background-color: #f2fff2;
}
.v-autocomplete .v-autocomplete-list {
  width: 100%;
  text-align: left;
  border: none;
  border-top: none;
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 1px solid #157977;
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
</style>

<template>
  <!--<div class="components-container-article">-->
    <div id='content'>
    <Split>
      <SplitArea :size="50">
        <textarea id="latex-editor" name="latex-editor" >
          {{content}}
        </textarea>
      </SplitArea>
      <SplitArea :size="50">
          <iframe id="preview" sandbox="allow-same-origin allow-scripts"></iframe>
      </SplitArea>
    </Split>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import CodeMirror from 'codemirror'
import 'codemirror/mode/stex/stex.js'
import 'codemirror/lib/codemirror.css'

import compile from '../../../../utils/js/latex/latex2html.js'
import VueSplit from 'vue-split-panel'
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

export default {
  name: 'LatexComponent',
  components: { VueSplit   },
  props: {
    hidePDF: Number
  },
  data() {
    return {
      postForm: {},
      editor: {},
      content: '',
      html: '',
      id: '',

    }
  },
  computed: {
    ...mapGetters(['sidebar', 'accessToken']),
    closeSidebar() {
      this.sidebar.opened = false
    }
  },
  created () {
    this.sidebar.opened = false
    this.id = this.$route.params && this.$route.params.id
    this.fetchData(this.id)
    this.convertLightEditor2Latex()
  },
  mounted () {
    var iframe = document.getElementById('preview')

    this.editor = CodeMirror.fromTextArea(document.getElementById("latex-editor"), {
      lineNumbers: true,
      lineWrapping: true,
      autoRefresh: true,
      scrollbarStyle: "null",
      mode: "text/x-stex"
    });
    this.editor.refresh();
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(async function(){
        await compile(this.editor.getValue(), iframe)
      },2000);
    })
    this.editor.on('change', (object) => {
      this.postForm.content = String(object.getValue())
      this.convertLatex2LightEditor()
      setTimeout(async () => {
        this.save()
       },2000);
      setTimeout(async ()=>{
        await compile(this.editor.getValue(), iframe)
        iframe.contentDocument.dispatchEvent(new Event('change'))
       },2000);
       setTimeout(() => void this.editor.refresh(), 0)
     })
  },
  methods: {
    convertLightEditor2Latex (){

    },
    convertLatex2LightEditor (){
      this.postForm.content
    },
    fetchData(id) {
      axios.get('/api/articles/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        this.postForm = response.data
        this.content = this.postForm.content
      }).catch(err => {
        console.log(err)
      })
    },
    save () {
      axios.put('/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"content": this.postForm.content,"tags": this.postForm.tags,"arr_content": this.postForm.arr_content,"tags" : '' ,"published": true
      }, { headers: {'Authorization': `Bearer ${this.accessToken}`} })
      .then(response => {
        console.log("article saved")
      })
      .catch(e => {
        console.log(e)
      })
    },
    // toggle class on all individual cursors
    cmToggleCursorsInnerClass (cm, theClass, newState) {
    	let cursors=Array.from(cm.getWrapperElement().getElementsByClassName('CodeMirror-cursor'))
    	cursors.forEach(c => { toggleClass(c, theClass, newState); })
    },
    // blink the cursor as thick red once
    cmBlinkCursorRedOnce (cm) {
    	cmToggleCursorsInnerClass(cm, 'redCursor', true)
    	setTimeout(() => { cmToggleCursorsInnerClass(cm, 'redCursor', false); }, 500)
    }
  },
  watch: {
    content (newVal) {
      if(this.editor)
        this.editor.setValue(this.content)
    }
  }
}
</script>
<style>
#content {
    display: flex;
}

#latex-editor {
    width: auto;
    height: auto;
    overflow: auto;
}

#preview {
    color: #333;
    border: none;
    width: 100%;
    height: 100%;
}

.CodeMirror {
  border: 1px solid #eee;
  height: auto;
  width: auto;
  word-wrap: break-word;
}
.CodeMirror-scroll {
  width: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
.CodeMirror-scroll *{
  width: auto;
}

/* splitter */

.gutter.gutter-horizontal {
    display: flex;
    align-items: center;
    line-height: 900px;
    font-size: 12px;
    font-family: sans-serif;
    letter-spacing: 2px;
    color: #ccc;
    text-shadow: 2px 0 2px black;
}

.split.split-horizontal {
    height : 900px;
}

.gutter::after {
    content: '.. .. .. ..';
}

.gutter {
    cursor: ew-resize;
    background-color: #eee;
}

/* LaTeX logo */

.latex span {
    text-transform: uppercase;
}

.latex span:first-child {
    font-size: 0.8em;
    vertical-align: 0.2em;
    margin-left:  -0.45em;
    margin-right: -0.15em;
}
.latex span:last-child {
    margin-left: -0.2em;
    margin-right: -0.2em;
    position: relative;
    top: 0.45ex;
}
</style>

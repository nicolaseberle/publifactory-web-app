<template>
  <!--<div class="components-container-article">-->
    <div id='content'>
    <Split>
      <SplitArea :size="50">
        <textarea id="latex-editor" name="latex-editor">
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
//import 'js/playground.bundle.min.js'

import { parse, HtmlGenerator } from 'latex.js'
import compile from '../../../../utils/js/latex/latex2html.js'
// import 'latex.js/dist/latex.min.js'
import VueSplit from 'vue-split-panel'

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
    ...mapGetters(['sidebar']),
    closeSidebar() {
      this.sidebar.opened = false
    }
  },
  created () {
    this.sidebar.opened = false
    this.id = this.$route.params && this.$route.params.id
    this.fetchData(this.id)
  },
  mounted () {
    this.editor = CodeMirror.fromTextArea(document.getElementById("latex-editor"), {
        value: this.content,
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: "text/x-stex"
     });

     var self = this
     var iframe = document.getElementById('preview')
     document.addEventListener('DOMContentLoaded', function() {
       compile(self.editor.getValue(), iframe)
       self.editor.refresh()
     })
     this.editor.on('change', function (object) {
       self.postForm.content = String(object.getValue())
       self.save()
       compile(self.editor.getValue(), iframe)
       iframe.contentDocument.dispatchEvent(new Event('change'))
     })

  },
  methods: {
    fetchData(id) {
      axios.get('/api/articles/' + id ).then(response => {
        this.postForm = response.data
        this.content = this.postForm.content
      }).catch(err => {
        console.log(err)
      })
    },
    save () {
      axios.put('/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"content": this.postForm.content,"tags": this.postForm.tags,"arr_content": this.postForm.arr_content,"tags" : '' ,"published": true })
      .then(response => {
        console.log("article saved")
      })
      .catch(e => {
        console.log(e)
      })
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
    height: auto;
}

#preview {
    color: #333;
    border: none;
    width: 100%;
    height: 100%;
}

/* splitter */

.gutter.gutter-horizontal {
    display: flex;
    align-items: center;
    line-height: 5px;
    font-size: 12px;
    font-family: sans-serif;
    letter-spacing: 2px;
    color: #ccc;
    text-shadow: 1px 0 1px black;

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

<template>
  <div class="components-container">
    <el-row :gutter="40">
      <form>
        <el-col v-if='hidePDF==1' :span="24">
          <textarea id="code" name="code">
            {{content}}
          </textarea>
        </el-col>
        <el-col v-if='hidePDF==0' :span="14">
          <textarea id="code" name="code">
            {{content}}
          </textarea>
        </el-col>
      </form>
      <el-col v-if='hidePDF==0' :span="10">
        <el-card class="box-card">
          <div v-html="html"/>
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import CodeMirror from 'codemirror'
import 'codemirror/mode/stex/stex.js'
import 'codemirror/lib/codemirror.css'

const source = `
\\documentclass{article}
\\begin{document}
Hello World!
\\end{document}
`


const defaultForm = {
  status: 'draft',
  title: '',
  abstract: '',
  content: '',
  arr_content: [{
                  name:"titre_1",
                  title:"Titre 1",
                  title_placeholder:"Titre 1",
                  content:"Type your text",
                  path_figure: "",
                  display:true
                }],
  content_short: '',
  source_uri: '',
  image_uri: '',
  display_time: undefined,
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

const latex_code = "" +
  "\\documentclass{article}" +
  "\\begin{document}" +
  "\\LaTeX is great!" +
  "$E = mc^2$" +
  "\\end{document}";

const content = `
\\documentclass[12pt]{article}
\\begin{document}

\\centerline{\\sc \\large A Simple Sample \\LaTeX\\ File}
\\vspace{.5pc}
\\centerline{\\sc Stupid Stuff I Wish Someone Had Told Me Four Years Ago}
\\centerline{\\it (Read the .tex file along with this or it won't
            make much sense)}
\\vspace{2pc}

The first thing to realize about \\LaTeX\\ is that it is not  WYSIWYG.
In other words, it isn't a word processor; what you type into your
.tex file is not what you'll see in your .dvi file.

\\end{document}
`

export default {
  name: 'LatexComponent',
  components: {  },
  props: {
    hidePDF: Number
  },
  data() {
    return {
      postForm: {},
      editor: {},
      content: content,
      html: ''
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
    // this.fetchData(this.id)
  },
  mounted () {
      this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        value: latex_code,
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: "text/x-stex"
     });
     // const pdf = pdflatex(source);

  },
  methods: {
    fetchData(id) {
      axios.get('/api/articles/' + id ).then(response => {
        this.postForm = response.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

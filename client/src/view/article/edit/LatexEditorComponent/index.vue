<template>
  <div class="components-container-article">
    <el-row :gutter="40" >
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
      content: '',
      html: '',
      id: ''
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
    this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        value: this.content,
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        mode: "text/x-stex"
     });
     var self = this
     this.editor.on("change", function (object) {
       self.postForm.content = String(object.getValue())
       self.save()
     })

     // const pdf = pdflatex(source);
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
      axios.put('/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"content": this.postForm.content,"arr_content": this.postForm.arr_content,"published": true })
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

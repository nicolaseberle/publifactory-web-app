<template>
  <div class="components-container">
    <el-row :gutter="40">
      <el-col :span="14">

          <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :z-index="20" @input='markdown2Html'/>

      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <div v-html="html"/>
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import MarkdownEditor from '../../../../components/MarkdownEditor'
import { mapGetters } from 'vuex'
import axios from 'axios'


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

const content = `
# Article Title

## Abstract

Firstly, an abstract of your article.

## Titre 1
### Titre 1.1

This is a paragraph

List example:
* First element
* Second element
* Third element
`
export default {
  name: 'MarkdownDemo',
  components: { MarkdownEditor },
  data() {
    return {
      postForm: {},
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
    this.fetchData(this.id)
  },
  mounted () {
    import('showdown').then(showdown => {
      const converter = new showdown.Converter()
      this.html = converter.makeHtml(this.content)
    })
  },
  methods: {
    markdown2Html(event) {
      import('showdown').then(showdown => {
        const converter = new showdown.Converter()
        this.html = converter.makeHtml(this.content)
      })
    },
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

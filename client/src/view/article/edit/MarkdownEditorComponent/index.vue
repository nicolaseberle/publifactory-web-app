<template>
  <div class="components-container-article">
    <el-row :gutter="40" style='box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);'>
      <!--<markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="800" :z-index="20" @input='markdown2Html'/>-->
      <Split style="height: 1000px; overflow:hidden">
      <SplitArea :size="50">
           <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="800" :z-index="20" @input='markdown2Html'/>
        </SplitArea>
        <SplitArea :size="50" style="background-color: #f3f3f3">
          <el-card class="box-card" style="margin: 10px 10px 10px 10px;">
            <div class='md' v-html="html"/>
          </el-card>
        </SplitArea>
    </Split>
<!--

      <el-col v-if='hidePDF==1' :span="24">


      </el-col>

      <el-col v-if='hidePDF==0' :span="14">


          <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :z-index="20" @input='markdown2Html'/>

      </el-col>
      <el-col v-if='hidePDF==0' :span="10">
        <el-card class="box-card">
          <div v-html="html"/>
        </el-card>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import MarkdownEditor from '../../../../components/MarkdownEditor'
import { mapGetters } from 'vuex'
import VueSplit from 'vue-split-panel'
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

## Title 1
### Title 2

This is a paragraph

List example:
* First element
* Second element
* Third element
`

export default {
  name: 'MarkdownDemo',
  components: { MarkdownEditor , VueSplit},
  props: {
    hidePDF: Number
  },
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
<style lang="scss">

.gutter.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}
/*
div.md{
  font-family: Helvetica,Arial,sans-serif;

  h1 {
    color: red;
  }
}
*/ 
</style>

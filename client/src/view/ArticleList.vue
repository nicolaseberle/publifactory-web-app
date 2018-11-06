<template>


  <div class="components-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="editor-container">
          <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :z-index="20"/>
        </div>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" icon="el-icon-document" @click="markdown2Html">Generate PDF</el-button>
        <div v-html="html"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MarkdownEditor from '../components/MarkdownEditor'

const content = `
# Titre 1
## Titre 2

This is a paragraph

* vue
* element
* webpack
`
export default {
  name: 'MarkdownDemo',
  components: { MarkdownEditor },
  data() {
    return {
      content: content,
      html: ''
    }
  },
  methods: {
    markdown2Html() {
      import('showdown').then(showdown => {
        const converter = new showdown.Converter()
        this.html = converter.makeHtml(this.content)
      })
    }
  }
}
</script>

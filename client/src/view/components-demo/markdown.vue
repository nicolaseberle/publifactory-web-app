<template>
  <div class="components-container-article">
    <div class="editor-container">
      <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :z-index="20"/>
    </div>
    <el-button style="margin-top:80px;" type="primary" icon="el-icon-document" @click="markdown2Html">To HTML</el-button>
    <div v-html="html"/>
  </div>
</template>

<script>
import MarkdownEditor from '../../components/MarkdownEditor'

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

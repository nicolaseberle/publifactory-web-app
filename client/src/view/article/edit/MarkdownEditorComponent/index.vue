<template>
  <div>
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
    }
  }
}
</script>

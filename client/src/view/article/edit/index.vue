<template>
  <div>
  <div class="components-container">
    <el-row type="flex" class="row-bg" justify="space-between" style="margin-bottom:20px;background-color:white">
      <el-col :span="4"><el-switch
        style="text-align:center;"
        v-model="editorType"
        active-color="#13ce66"
        inactive-color="#4949FF"
        active-text="Markdown"
        inactive-text="LightEditor"
        @input='changeEditor'>
      </el-switch></el-col>
          <el-col v-if="true" :span="4" :offset="18"><el-button type="primary">Submit your article</el-button></el-col>
          <!--<el-col v-if="postForm.status == 'Reviewing'" :span="4" :offset="18"><el-button type="warning">Edit this version</el-button></el-col>-->
    </el-row>
  </div>
  <div>
      <component v-bind:is="currentEditor"/>
  </div>
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
import velocity from 'velocity-animate'
import lightEditorComponent from './LightEditor'
import markdownEditorComponent from './MarkdownEditorComponent'

export default {
  name: 'ArticleDetail',
  components: { lightEditorComponent, markdownEditorComponent },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // postForm: Object.assign({}, defaultForm),
      currentEditor: 'lightEditorComponent',
      editorType: false
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  created() {
    if (1) {
      this.currentEditor = 'lightEditorComponent'
    }
  },
  mounted() {
  },
  methods: {
    changeEditor (ev) {
      if (this.editorType == true){
        this.currentEditor = 'markdownEditorComponent'
      }
      else{
        this.currentEditor = 'lightEditorComponent'
      }
      console.log(this.currentEditor)
      console.log(this.editorType)
    }
  }
}
</script>

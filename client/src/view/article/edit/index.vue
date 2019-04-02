<template>
  <div>
  <div class="components-container-article">
    <el-row type="flex" class="row-bg" justify="space-between" style="margin-bottom:20px;background-color:white" :gutter="40">
      <el-col :span="12">
        <el-button-group>
          <el-button v-if="valueTypeEditor==1" type="primary" round  @click="changeEditor('LightEditor')">Light Editor</el-button>
          <el-button v-if="valueTypeEditor!=1" type="" round @click="changeEditor('LightEditor')">Light Editor</el-button>
          <el-button v-if="valueTypeEditor==2" type="primary" round @click="changeEditor('MarkdownEditor')">Markdown</el-button>
          <el-button v-if="valueTypeEditor!=2" type="" round @click="changeEditor('MarkdownEditor')">Markdown</el-button>
          <el-button v-if="valueTypeEditor==3" type="primary" round @click="changeEditor('LatexEditor')">Latex</el-button>
          <el-button v-if="valueTypeEditor!=3" type="" round @click="changeEditor('LatexEditor')">Latex</el-button>
        </el-button-group>
        <el-dropdown trigger="click" class="international" @command="actionHandleCommand">
          <div>
            <el-button class="el-button-action" round>Version<i class="el-icon-arrow-down" style='margin-left:10px'/></el-button>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="v1">Submited</el-dropdown-item>
            <el-dropdown-item command="v2">Reviewed - 01/08/2018</el-dropdown-item>
            <el-dropdown-item command="v3">Reviewed - 10/09/2018</el-dropdown-item>
            <el-dropdown-item command="v4">Reviewed - 15/09/2018</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="12">
        <div style='text-align:right'>
          <el-button-group>
            <el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==0" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>
            <el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==1" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>
            <el-button type="" round disabled>Download the article</el-button>
            <el-button type="" round >Submit your article</el-button>
          </el-button-group>
        </div>
      </el-col>
      <!--<el-col v-if="postForm.status == 'Reviewing'" :span="4" :offset="18"><el-button type="warning">Edit this version</el-button></el-col>-->
    </el-row>
  </div>
  <div>
      <component v-bind:is="currentEditor" :hidePDF="flagHidePDF"/>
  </div>
  </div>

</template>
<script>
import { mapGetters } from 'vuex'
import velocity from 'velocity-animate'
import lightEditorComponent from './LightEditor'
import markdownEditorComponent from './MarkdownEditorComponent'
import latexEditorComponent from './LatexEditorComponent'

export default {
  name: 'ArticleDetail',
  components: { lightEditorComponent, markdownEditorComponent, latexEditorComponent },
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
      valueTypeEditor: 1,
      flagHidePDF:1,
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
    actionHandleCommand (action) {

    },
    handleHidePDF () {
      if(this.flagHidePDF == 1){
        this.flagHidePDF = 0
        console.log(this.flagHidePDF)
      }
      else{
        this.flagHidePDF = 1
        console.log(this.flagHidePDF)
      }

    },
    changeEditor (newValue) {
      if(newValue=='LightEditor'){
        this.currentEditor = 'lightEditorComponent'
        this.valueTypeEditor = 1
      }
      else{
         if (newValue=='MarkdownEditor') {
           this.currentEditor = 'markdownEditorComponent'
           this.valueTypeEditor = 2
         }
         else{
           this.currentEditor = 'latexEditorComponent'
           this.valueTypeEditor = 3
         }
      }
    }
  }
}
</script>

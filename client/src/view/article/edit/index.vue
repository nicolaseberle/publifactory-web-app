<template>
  <div>
  <div class="components-container-article">
    <el-row type="flex" class="row-bg" justify="space-between" style="margin-bottom:20px;background-color:white" :gutter="40">
      <el-col :span="10">
        <el-button-group>
          <el-button v-if="valueTypeEditor==1" type="primary"  @click="changeEditor('LightEditor')">Light Editor</el-button>
          <el-button v-if="valueTypeEditor!=1" type=""  @click="changeEditor('LightEditor')">Light Editor</el-button>
          <el-button v-if="valueTypeEditor==2" type="primary"  @click="changeEditor('MarkdownEditor')">Rich Text</el-button>
          <el-button v-if="valueTypeEditor!=2" type=""  @click="changeEditor('MarkdownEditor')">Rich Text</el-button>
          <el-button v-if="valueTypeEditor==3" type="primary"  @click="changeEditor('LatexEditor')">Latex</el-button>
          <el-button v-if="valueTypeEditor!=3" type=""  @click="changeEditor('LatexEditor')">Latex</el-button>
        </el-button-group>
        <el-dropdown split-button type="primary" >
          <!--<svg-icon icon-class='history-clock'/><span style='margin-left:10px'>Version </span>-->
          Version
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>Submited</el-dropdown-item>
            <el-dropdown-item>Reviewed - 01/08/2018</el-dropdown-item>
            <el-dropdown-item>Reviewed - 10/09/2018</el-dropdown-item>
            <el-dropdown-item>Reviewed - 15/09/2018</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="8">

        <el-button-group>

          <el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==0" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>
          <el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==1" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>
          <el-button type="" round disabled>Download the article</el-button>
          <el-button type="" round >Submit your article</el-button>
        </el-button-group>
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
      flagHidePDF:0,
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

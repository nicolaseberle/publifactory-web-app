<template>
  <div>
  <div class="components-container-article">
    <el-row type="flex" class="row-bg" justify="space-between" style="margin-bottom:20px;background-color:white" :gutter="40">
      <el-col :span="8">
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
      <el-col :span='8'>
        <el-button-group >

          <el-button v-if="this.articleInfo.status === 'Submited' && commentStateVector.nbSolved !== 0" alt='Number of comments' type="info" @click='showCOmmentReviewPanel'  round><svg-icon icon-class='black-bubble-speech'/> {{commentStateVector.nbComment}}</el-button>
          <el-button v-if="this.articleInfo.status === 'Submited' && commentStateVector.nbSolved == 0" alt='Number of resolved reviews' type="success" icon='el-icon-success' @click='showCOmmentReviewPanel'  round>{{commentStateVector.nbResolved}}</el-button>
          <el-button v-if="this.articleInfo.status === 'Submited' && commentStateVector.nbWarning !== 0" alt='Number of minor reviews' type="warning" icon='el-icon-warning' @click='showCOmmentReviewPanel' round>{{commentStateVector.nbWarning}}</el-button>
          <el-button v-if="this.articleInfo.status === 'Submited' && commentStateVector.nbWarning == 0" alt='Number of minor reviews' type="" icon='el-icon-warning' @click='showCOmmentReviewPanel' round>{{commentStateVector.nbWarning}}</el-button>

          <el-button v-if="this.articleInfo.status === 'Submited' && commentStateVector.nbDanger !== 0" alt='Number of major reviews' type="danger" icon='el-icon-remove' @click='showCOmmentReviewPanel' round>{{commentStateVector.nbDanger}}</el-button>
          <el-button v-if="this.articleInfo.status === 'Submited' && commentStateVector.nbDanger == 0" alt='Number of major reviews' type="" icon='el-icon-remove' @click='showCOmmentReviewPanel' round>{{commentStateVector.nbDanger}}</el-button>
        </el-button-group>

      </el-col>
      <el-col :span="8">
        <div style='text-align:right'>
          <el-button-group>
            <el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==0" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>
            <el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==1" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>
            <el-button type="" round disabled>Download the article</el-button>
            <el-button v-if="  this.articleInfo.status === 'Draft' " type="" @click="visibleDialogSubmProcess=true" round >Submit your article</el-button>
            <el-button v-if="  this.articleInfo.status === 'Submited' " type="" @click="changeStatus()" round disabled>Submitted</el-button>
            <el-button v-if="  this.articleInfo.status === 'Reviewing' " type="" @click="changeStatus()" round >Validate the article</el-button>
          </el-button-group>
        </div>
      </el-col>
      <!--<el-col v-if="postForm.status == 'Reviewing'" :span="4" :offset="18"><el-button type="warning">Edit this version</el-button></el-col>-->
    </el-row>
    <el-row >
      <el-col :span="24">
        <el-alert v-if="  this.articleInfo.status === 'Submited' "
          title="Article Submitted"
          type="success"
          description="The article is being processed by the publisher. A notification will be sent to you to keep you informed of the evolution of the peer-reviewing."
          show-icon>
        </el-alert>
      </el-col>
    </el-row>
  </div>
  <div>

      <component v-bind:is="currentEditor" :hidePDF="flagHidePDF" v-on:changecomment='onChangeComment'/>
  </div>
  <el-dialog
    title="Submission process"
    :visible.sync="visibleDialogSubmProcess"
    width="50%">
    <el-alert
      title="You are about to submit your article"
      type="warning"
      show-icon>
    </el-alert>
    <el-form style='text-align:left'>
      <el-row style='margin-top:20px'>

        <el-form-item label="Have you uploaded your article to a preprint server?" label-width="200px">
          <el-col :span='10' :offset='1'>
            <el-radio v-model="formSubmArticle.preprint" label="yes">Yes</el-radio>
              <el-radio v-model="formSubmArticle.preprint" label="no">No</el-radio>
          </el-col>
          <el-col :span='12' >
            <el-input placeholder="Please enter the DOI" v-model="formSubmArticle.doi" :disabled="formSubmArticle.preprint === 'no'">
              <template slot="prepend">DOI</template>
            </el-input>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row style='margin-top:10px'>
        <el-form-item label="Would you like us to handle the request for a DOI?" label-width="200px" :disabled="formSubmArticle.preprint === 'yes'">
          <el-col :span='10' :offset='1'>
            <el-radio v-model="formSubmArticle.wishDOI" label="yes" :disabled="formSubmArticle.preprint === 'yes'">Yes</el-radio>
            <el-radio v-model="formSubmArticle.wishDOI" label="no" :disabled="formSubmArticle.preprint === 'yes'">No</el-radio>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row style='margin-top:10px'>
        <el-form-item label="Which Peer reviewing do you want?" label-width="200px">
          <el-col :span='23' :offset='1'>
            <el-radio v-model="formSubmArticle.options" label="classic">Classic peer-reviewing</el-radio>
            </el-col>
            <el-col :span='23' :offset='1'>
              <el-radio v-model="formSubmArticle.options" label="open">Open peer-reviewing</el-radio>
              </el-col>
        </el-form-item>
        </el-row>
        <el-row style='margin-top:10px'>
          <el-form-item label="Journal" label-width="200px">
            <el-col :span='23' :offset='1'>
            <el-select v-model="formSubmArticle.journal" placeholder="Please select the journal" style='width:100%'>
              <div v-for='journal in journalList'>
                <el-option :label="journal.name" :value="journal._id"></el-option>
              </div>
              <!--<el-option label="PCI Evol Biol" value="pci_evol_bio"></el-option>
              <el-option label="PCI Ecology" value="pci_ecology"></el-option>
              <el-option label="PCI Paleo" value="pci_paleo"></el-option>-->
            </el-select>
            </el-col>
          </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleDialogSubmProcess = false">Cancel</el-button>
      <el-button type="primary" @click="onSubmit()">Submit</el-button>
    </span>
  </el-dialog>

  </div>

</template>
<script>
import { mapGetters } from 'vuex'
import velocity from 'velocity-animate'
import lightEditorComponent from './LightEditor'
import markdownEditorComponent from './MarkdownEditorComponent'
import latexEditorComponent from './LatexEditorComponent'
import axios from 'axios'

export default {
  name: 'ArticleDetail',
  components: { lightEditorComponent, markdownEditorComponent, latexEditorComponent },
  data() {
    return {
      // postForm: Object.assign({}, defaultForm),
      currentEditor: 'lightEditorComponent',
      valueTypeEditor: 1,
      flagHidePDF:1,
      editorType: false,
      id: '',
      articleInfo : '',
      visibleDialogSubmProcess: false,
      commentStateVector: {nbComment:0,nbWarning:0,nbDanger:0,nbSolved:0},
      formSubmArticle: {journal:'',options:'open',preprint: 'no',wishDOI:'yes'},
      journalList: [{name:'PCI 1',_id:'#lsmdkfsdj'},{name:'PCI 2',_id:'#mlqskdlmqd'}]
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created() {

    if (1) {
      this.id = this.$route.params && this.$route.params.id
      this.currentEditor = 'lightEditorComponent'
      this.getStatus()
    }
  },
  mounted() {
    this.getJournalList()
  },
  methods: {
    showCOmmentReviewPanel () {
      $("aside.content-comments-reviews").css('display', 'block')
    },
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
    },
    onSubmit() {

      // formSubmArticle.options
      // formSubmArticle.preprint
      // formSubmArticle.wishDOI
      // formSubmArticle.journal
      this.changeStatus ()
      this.sendNotificationByMail()
      this.visibleDialogSubmProcess = false
    },
    async getStatus() {
        this.articleInfo = await new Promise((resolve, reject) => {
        axios.get('/api/articles/' + this.id, { headers: { 'Authorization': 'Bearer ' + this.accessToken } })
          .then(data => resolve(data.data))
          .catch(err => reject(err))
      });
    },

    onChangeComment (commentStateVector) {
      this.commentStateVector = commentStateVector
    },
    async changeStatus () {
      this.articleInfo = await new Promise((resolve, reject) => {
        axios.get('/api/articles/' + this.id, { headers: { 'Authorization': 'Bearer ' + this.accessToken } })
          .then(data => resolve(data.data))
          .catch(err => reject(err))
      });
      if (this.articleInfo.status === 'Submited')
        axios.patch(`/api/articles/${this.id}/review`, {},
          { headers: { 'Authorization': `Bearer ${this.accessToken}` }});
      else if (this.articleInfo.status === 'Reviewing')
        axios.patch(`/api/articles/${this.id}/publish`, {},
          { headers: { 'Authorization': `Bearer ${this.accessToken}` }});
      else if (this.articleInfo.status === 'Draft')
        axios.patch(`/api/articles/${this.id}/submit`, {},
          { headers: { 'Authorization': `Bearer ${this.accessToken}` }});
      this.$router.push(this.$route.query.redirect || '/')
    },
    getJournalList () {

    },
    sendNotificationByMail () {
      //send a notification to authors


      //send notification to editor/publisher/associate editor

    }
  }
}
</script>

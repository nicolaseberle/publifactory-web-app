<template>
  <div class="components-container">
  <el-tabs type="border-card" stretch  v-model="activeName_tab" @tab-click="handleClick">
    <el-tab-pane label="" name="article">
      <main class="article">
        <article>
          <span id="triggerStartNav"></span>
            <header>
                <el-row v-if="postForm.status == 'Reviewing'">
                    <el-button style=' width:100%; background-color:#FFEEAD; height:4rem; text-align:center; color:#333333; weight:bold; margin:0px 0px 10px 0px; border-style: none;'>{{postForm.status}} in progress</el-button>
                </el-row>

                <el-row v-else>
                  <h2>Research article <span class="category grey">{{postForm.status}}</span></h2>
                </el-row>
                <!--<div class="article-info">
                    <p class="font-style-normal">Original article in <a href="#" title="See the original article in PLoS ONE plateform" target="_blank">PLoS ONE</a></p>
                    <p class="green font-dnltp-bold font-style-normal"><time datetime="2017-11-03" pubdate="pubdate" >Published on 12/06/2018 </time></p>
                    <p class="font-dnltp-bold font-style-bold">20 Reads</p>
                    <p class="font-dnltp-bold font-style-bold">Cited 200 times</p>
                </div>-->
                <p class="article-doi">DOI : {{postForm.doi}}</p>
                <!--<h1>{{ postForm.title }} </i></h1>-->
                <h1>
                  <form name="article_title_form">
                    <textarea-autosize
                      placeholder="Article Title"
                      ref="TitleTextArea"
                      v-model="postForm.title"
                      :min-height="30"
                      :cols="35"
                      :max-height="350"
                      @blur.native="onBlurTextarea"
                      @input="save($event)"
                    ></textarea-autosize>
                    <br>
                  </form>
               </h1>
                <div class="article-author">
                  <el-button icon="el-icon-plus" class="insert-buttons" @click="dialogTableVisible = true" title="Invite another author" circle v-on:click="diagAuthorVisible=true"></el-button>
                  <img v-for="item in postForm.authors" :src="item.avatar"></img>
                    <p>
                        <a v-for="item in postForm.authors" href="#" title="author">{{item.firstname}} {{item.lastname}}, </a>
                    </p>
                </div>

                <div class="article-tag">
                    <a v-for="item in postForm.tags" href="#" title="Search more articles with this tag" ><h4>{{item}}</h4></a>
                </div>
            </header>
            <section  class="abstract">
                <h2>Abstract</h2><br>
                <form name="abstract_form_2">
                  <medium-editor id='abstract' :text='postForm.abstract' :options='options' v-on:edit="applyAbstractEdit($event)"/>
                  <!--<ckeditor :editor="editor" v-model="postForm.abstract" :config="editorConfig"></ckeditor>-->
                </form>
            </section>
            <div v-for="(item,key) in postForm.arr_content">
              <section id="item.title">
                  <h2>
                    <i v-bind:class="['el-icon-arrow-down', { 'el-icon-arrow-right' : item.display }]"  @click="openItem(item)"> </i>
                    <input type="text" v-model="item.title" name="title" placeholder="Article Title" @input="save($event)" ><br>
                  </h2>
                  <transition v-on:enter="enter" v-on:leave="leave">
                  <div class="accordion-panel" v-show="item.display">
                    <form name="abstract_form">
                      <quill-editor v-bind:numBlock='key' v-bind:uuid='item.uuid' v-bind:content="item.content" v-on:edit='applyTextEdit_3'></quill-editor>
                    </form>

                    <span v-html="item.path_figure"></span>
                  </div>
                  </transition>
                  <footer>
      						<div class='section-footer-left'>
      								<el-button  icon="el-icon-plus"  class="insert-buttons" title="Add a section" v-on:click="addNewRow($event,key)" circle></el-button>
      						</div>
      						<div class='section-footer-right'>
                    <el-tooltip class="item" effect="dark" content="Insert figures" placement="top-start">
                      <el-button  type="primary" v-on:click="openEditFigure($event,key)" plain circle> <v-icon name="chart-bar" scale="1"/></el-button>
                    </el-tooltip>
                    <el-button  type="info"  icon="el-icon-delete" v-on:click="removeRow($event,key)"circle/>
      					</div>
      					</footer>

              </section>
            </div>
            <span id="triggerEndNav"></span>
        </article>
    </main>
          </el-tab-pane>
        </el-tabs>

    <aside  class="comments-reviews" >
        <p>Show comments &amp; reviews</p>
    </aside>
    <aside type="button" class="content-comments-reviews" id="triggerAside">
          <reviewComponent />
    </aside>

    <el-dialog
      title="Insert a figure"
      :visible.sync="dialogVisible"
      width="80%"
      top="0">
      <el-steps align-center :active="dialogStepActive" finish-status="success">
      <el-step title="Import your data" description="Upload or drop your .xls or .csv file...">

      </el-step>
      <el-step title="Select a method" description="How to manage your data">

      </el-step>
      <el-step title="Setup it" description="Select the inputs, baptize your figure and that's it..."></el-step>
    </el-steps>
    <div v-if='dialogStepActive==0'>
      <h2 style="text-align:left;">Import</h2>
      <el-tabs type="border-card">
        <el-tab-pane label="Upload"><uploadData/></el-tab-pane>
        <el-tab-pane label="by URL">(not yet)</el-tab-pane>
        <el-tab-pane label="SQL">(not yet)</el-tab-pane>
        <el-tab-pane label="Example">
          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checkedExData1">Exemple 1</el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="checkedExData2">Exemple 2</el-checkbox>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <el-checkbox v-model="checkedExData3">Exemple 3</el-checkbox>
          </el-col>
        </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if='dialogStepActive==1'>
      <el-row :gutter="20" style='margin-top:3rem'>
        <el-col :span="4">
          <el-card shadow="hover">
            <img src="/../../static/img/plotly-logo.png" style="width: 70%;" alt="Chart Manager" v-on:click="addNewFigure($event)">
          </el-card>
        </el-col>
        <el-col :span="20">
          <el-card shadow="hover">
            <div slot="header" class="clearfix" style='text-align:left'>
              <span>Light Chart Editor</span>
            </div>
            <div style='text-align:left'>
              The easy way to create a simple chart. Intergate it in the text.
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style='margin-top:1rem'>
        <el-col :span="4">
          <el-card shadow="hover">
            <img src="/../../static/img/Python_logo.png" style="width: 70%;" alt="Python_script">
          </el-card>
        </el-col>
        <el-col :span="20">
          <el-card shadow="hover">
            <div slot="header" class="clearfix" style='text-align:left'>
              <span>Expert - Python script </span>
            </div>
            <div style='text-align:left'>
              Write your script in Python, generate your figure and integrate it in the text
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style='margin-top:1rem'>
        <el-col :span="4">
          <el-card shadow="hover">
            <img src="/../../static/img/R_logo.png" style="width: 70%;" alt="R_script">
          </el-card>
        </el-col>
        <el-col :span="20">
          <el-card shadow="hover">
            <div slot="header" class="clearfix" style='text-align:left'>
              <span>Expert - R script </span>
            </div>
            <div style='text-align:left'>
              Write your script in R, generate your figure and integrate it in the text
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--
      <component :is="datatable" v-if='dialogStepActive==0'/>
      <component :is="mixchart" v-if='dialogStepActive==1'/>
      <component :is="setupchart" v-if='dialogStepActive==2'/>-->
      <!--<iframe src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/table/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px;"></iframe>-->
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="previousStep">Previous step</el-button>
            <el-button type="primary"style="margin-top: 12px;" @click="nextStep">Next step</el-button>-->
        <el-button v-if='dialogStepActive==0' type="primary" v-on:click="addNewFigure($event)">Next</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Add one or many authors"
      :visible.sync="diagAuthorVisible"
      width="50%">

      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
            <el-form-item
              v-for="(email, index) in dynamicValidateForm.email"
              label="Email"
              :key="email.key"
              :prop="'email.' + index + '.value'"
              :rules="[
                { required: true, message: 'Please input email address', trigger: 'blur' },
                { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
              ]"
            >
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-input v-model="email.value"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="defaultPermission" placeholder="Permission">
                    <el-option
                      v-for="item in optionsPermissions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <!--<el-button @click.prevent="removeDomain(domain)">Delete</el-button>-->
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type=""  @click="diagAuthorVisible=false" >Cancel</el-button>
        <el-button type="primary" @click="diagAuthorVisible=false" >Send Invitation</el-button>
      </span>
    </el-dialog>
    <el-dialog
      show-close
      top="0"
      :visible.sync="diagInsertFigureVisible"
      width="100%"
      center>

      <span slot="title" class="dialog-header" >
        <div style='text-align:right;'>
          <el-button type=""  @click="diagInsertFigureVisible=false" >Cancel</el-button>
          <el-button type="primary" @click="" >Preview</el-button>
          <el-button type="primary" @click="diagInsertFigureVisible=false" >Insert Figure</el-button>
        </div>
      </span>

      <figureFactory/>

      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>

</template>
<script>
import editor from 'vue2-medium-editor'
import { mapGetters } from 'vuex'
import MarkdownEditor from '../../../../components/MarkdownEditor'
import { validateURL } from '../../../../utils/validate'
import axios from 'axios'
import velocity from 'velocity-animate'
import uploadData from './uploadData'
import asideRightAnimation from '../../../../utils/js/animation/aside.right.js';

import reviewComponent from '../../../../components/Review'
import quilleditor from '../../../../components/QuillEditor'

var Quill = require('quill');
var uuidv4 = require('uuid/v4');



import figureFactory from '../../../../components/Charts'

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

const options = {
  toolbar: {
    buttons: [
      'bold',
      'italic',
      'underline',
      'anchor',
      'quote',
      'image'
    ]
  }
}

export default {
  name: 'LightEditor',
  components: {figureFactory, MarkdownEditor,'medium-editor': editor , reviewComponent, 'quill-editor' : quilleditor, uploadData},
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + 'required',
          type: 'error'
        })
        callback(new Error(rule.field + 'required'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: 'wrong url chain',
            type: 'error'
          })
          callback(new Error('wrong url chain'))
        }
      } else {
        callback()
      }
    }
    return {
      data: [{
        x:['Marc', 'Henrietta', 'Jean', 'Claude', 'Jeffrey', 'Jonathan', 'Jennifer', 'Zacharias'],
        y: [90, 40, 60, 80, 75, 92, 87, 73],
        type: 'bar',
        orientation: 'v'
      }],
      layout: {
        title: 'Surname occurence',
        showlegend: false
      },
      options: {},

      dynamicValidateForm: {
          email: [{
            key: 1,
            value: ''
          }]
        },
      postForm: {},
      loading: false,
      diagAuthorVisible : false,
      diagInsertFigureVisible: false,
      userListOptions: [],
      html: '',
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      activeNames: ['1'],
      activeNames_section: ['1'],
      options: options,
      activeName_tab: 'article',
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      dialogStepActive: 0,
      addFigureInBlock: 0,
      editorType: false,
      checkedExData1: false,
      checkedExData2: false,
      checkedExData3: false,
      id: 0,
      form: {
          name: '',
          surname: '',
          mail: ''
        },
    chartOption : {
      name:'Figure_01',
      type: 'bar',
      direction:'horizontal'
    },
    optionsChartType: [{
     value: 'bar',
     label: 'Bar'
   }, {
     value: 'scatter',
     label: 'Scatter',
     disabled: true
   }, {
     value: 'pie',
     label: 'Pie',
     disabled: true
   }, {
     value: 'heatmap',
     label: 'Heatmap',
     disabled: true
   }],
   optionsChartDirection: [{
      value: 'horizontal',
      label: 'Horizontal'
    }, {
      value: 'vertical',
      label: 'Vertical'
    }],
    optionsPermissions: [{
          value: 'edit',
          label: 'Edit'
        }, {
          value: 'view',
          label: 'View'
        }, {
          value: 'admin',
          label: 'Admin'
        }],
        defaultPermission: 'edit'
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    contentShortLength() {
      return this.postForm.content_short.length
    },
    closeSidebar() {
      this.sidebar.opened = false
    }
  },
  created() {
    if (1) {
      this.sidebar.opened = false
      const id = this.$route.params && this.$route.params.id
      this.id = id
      this.fetchData(id)

    } else {
      this.postForm = Object.assign({}, defaultForm)
    }


  },
  mounted() {
      asideRightAnimation()
  },
  methods: {
    nextStep() {
        if (this.dialogStepActive++ > 2) this.dialogStepActive = 0;
    },
    previousStep() {
        if (this.dialogStepActive-- < 0 ) this.dialogStepActive = 0;
    },

    handleClose(done) {
        this.$confirm('Are you sure to close this dialog?')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    handleClick(tab, event) {

    },
    fetchData(id) {
      axios.get('/api/articles/' + id ).then(response => {
        this.postForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    openItem: function(item){
      item.display = !  item.display
    },
    setClass: function (item) {
      if (item.display === true) {
        return 'open'
      }
      return 'close'
    },
    enter: function (el, done) {
      velocity(el, 'slideDown', { duration: 400, easing: 'easeInBack' },
        { complete: done })
    },
    leave: function (el, done) {
      velocity(el, 'slideUp', { duration: 400, easing: 'easeInBack' },
        { complete: done })
    },

    save (ev) {
      axios.put('/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"arr_content": this.postForm.arr_content,"published": true })
      .then(response => {
        console.log("article saved")
      })
      .catch(e => {
        console.log(e)
      })
    },

    applyAbstractEdit (ev) {
      if (ev.event.target) {
        this.postForm.abstract = ev.event.target.innerHTML
        this.save(ev);
      }
    },
    applyTextEdit (ev,key) {
      if (ev.event.target) {
        this.postForm.arr_content[key].content = ev.event.target.innerHTML
        this.save(ev)
      }
    },
    applyTextEdit_2 (content,key) {
      this.postForm.arr_content[key].content = content.ops[0].insert
      this.save(this.$event)
    },
    applyTextEdit_3 (editor, delta, source,key) {
      this.postForm.arr_content[key].content = editor.root.innerHTML

      this.save(this.$event)
    },
    addNewRow (ev,key) {
      var uuid_ = String(uuidv4())
      var new_content = {
        name:"titre_1",
        uuid: uuid_,
        title:"Titre 1",
        title_placeholder:"Titre 1",
        content:"Type the text",
        path_figure: "",
        display:true
      }
      this.postForm.arr_content.splice(key+1,0, new_content);
      this.save(ev)
    },
    removeRow (ev,key) {
      this.postForm.arr_content.splice(key, 1);
      this.save(ev)
      if(this.postForm.arr_content == ''){
        var new_content = {
          name:"titre_1",
          title:"Titre 1",
          title_placeholder:"Titre 1",
          content:"Type the text",
          path_figure: "",
          display:true
        }
        this.postForm.arr_content.splice(key+1,0, new_content);
        this.save(ev)
      }

    },
    openEditFigure (ev,key) {

      this.dialogVisible = true;
      this.addFigureInBlock = key;
    },
    addNewFigure (ev){
      this.dialogStepActive++;
      if(this.dialogStepActive == 2){
        this.dialogVisible = false;
        this.diagInsertFigureVisible = true;
        this.dialogStepActive = 0;
      }
      //this.save(ev);
      //this.postForm.arr_content[this.addFigureInBlock].path_figure = '<iframe  src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/table/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px;"></iframe>'
    },/*
    save(event) {
        console.log('hello on enregristre')
        articleRes.saveChange({ "title": this.postForm.title,"abstract":this.postForm.abstract,"arr_content": this.postForm.content,"published": true }).then(res => {
          this.postForm = response.data
       //this.$notify.success(this.$t('message.save.ok'))
     }).catch(err => {
       console.log(err)
     })
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: 'success',
            message: 'Article successfully submited',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: 'Please fill in the necessary title and content',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: 'Saved successfully',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },*/
    markdown2Html() {
      import('showdown').then(showdown => {
        const converter = new showdown.Converter()
        this.html = converter.makeHtml(this.postForm.content)
      })
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>
<style>
.el-dialog--center .el-dialog__body{
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;

}

</style>

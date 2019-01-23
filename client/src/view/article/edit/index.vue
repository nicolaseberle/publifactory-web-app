<template>
  <div class="components-container">
    <el-row style="height: 40px;">
      <el-switch
        style="display: block"
        v-model="editorType"
        active-color="#13ce66"
        inactive-color="#4949FF"
        active-text="Latex"
        inactive-text="Editor">
      </el-switch>
  </el-row>
    <el-tabs type="border-card" stretch=True  v-model="activeName_tab" @tab-click="handleClick">
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
                    <textarea name="Text1" v-model="postForm.title" cols="35" rows="3"  @input="save($event)"></textarea>
                    <!--<input type="text" v-model="postForm.title" name="title" placeholder="Article Title" @input="save($event)"/>-->
                    <br>
                  </form>
               </h1>
                <div class="article-author">
                  <el-button icon="el-icon-plus" class="insert-buttons" @click="dialogTableVisible = true" title="Invite another author" circle></el-button>
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
                  <medium-editor :text='postForm.abstract' :options='options' v-on:edit="applyAbstractEdit($event)"/>
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
                      <!--<ckeditor :editor="editor" v-model="item.content" :config="editorConfig" v-on:edit="applyTextEdit($event,key)"></ckeditor>-->
                      <medium-editor  :text='item.content' :options='options' v-on:edit="applyTextEdit($event,key)" />
                    </form>

                    <span v-html="item.path_figure"></span>


                  </div>
                  </transition>
                  <footer>
      						<div class='section-footer-left'>
      								<el-button  icon="el-icon-plus"  class="insert-buttons" title="Add a section" v-on:click="addNewRow($event,key)" circle></el-button>
      						</div>
      						<div class='section-footer-right'>
                    <el-tooltip class="item" effect="dark" content="Insert figures" placement="top-start" open-delay='200'>
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
      width="50%">
      <el-steps align-center :active="dialogStepActive" finish-status="success">
      <el-step title="Upload your data" description="Import or drop your .xls or .csv file..."></el-step>
      <el-step title="Select a chart" description="Choose among a set or standard charts"></el-step>
      <el-step title="Setup it" description="Select the inputs, baptize your figure and that's it..."></el-step>
    </el-steps><!--
      <component :is="datatable" v-if='dialogStepActive==0'/>
      <component :is="mixchart" v-if='dialogStepActive==1'/>
      <component :is="setupchart" v-if='dialogStepActive==2'/>-->
      <!--<iframe src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/table/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px;"></iframe>-->
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="previousStep">Previous step</el-button>
            <el-button type="primary"style="margin-top: 12px;" @click="nextStep">Next step</el-button>-->
        <el-button type="primary" v-on:click="addNewFigure($event)" >Insert</el-button>
      </span>
    </el-dialog>

  </div>




</template>
<script>
import editor from 'vue2-medium-editor'
import { mapGetters } from 'vuex'
import MarkdownEditor from '../../../components/MarkdownEditor'
import { validateURL } from '../../../utils/validate'
import { article as articleRes } from 'resources'
import axios from 'axios'
import velocity from 'velocity-animate'
import asideRightAnimation from '../../../utils/js/animation/aside.right.js';
// import datatable from './data'
// import uploadExcel from './uploadExcel'
// import scriptView from './scriptView'
// import chartView from './chartView'
// import setupChart from './setupChart'

import reviewComponent from '../../../components/Review'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import InlineEditor from '@ckeditor/ckeditor5-build-inline';


const defaultForm = {
  status: 'draft',
  title: '',
  abstract: '',
  content: '',
  arr_content: [{
                  name:"titre_1",
                  title:"Titre 1",
                  title_placeholder:"Titre 1",
                  content:"Type the text",
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
  name: 'ArticleDetail',
  components: { MarkdownEditor, 'medium-editor': editor , reviewComponent},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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
      /* editorConfig: {
            // The configuration of the editor.
      },*/
      // editor: InlineEditor,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      html: '',
      content: "content",
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
      id: 0,
      form: {
          name: '',
          surname: '',
          mail: ''
        }
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
      console.log("creation de la page")
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
      console.log(tab, event);
    },
    handleChange_section(val) {
      console.log(val);
    },
    handleChange(val) {
      console.log(val)
    },
    fetchData(id) {
      console.log(id)
      articleRes.query({ _id: id }).then(response => {
        this.postForm = response.data
        // Just for test
        //this.postForm.title += `   Article Id:${this.postForm.id}`
        //this.postForm.content_short += `   Article Id:${this.postForm.id}`
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
        console.log("save successfully")
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
    addNewRow (ev,key) {
      var new_content = {
        name:"titre_1",
        title:"Titre 1",
        title_placeholder:"Titre 1",
        content:"Type the text",
        path_figure: "",
        display:true
      }
      //var new_content = {name: title_name,title: null,display:false,title_placeholder:title_name,content:"Type the text"}
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
      this.dialogVisible = false;
      this.save(ev);
      this.postForm.arr_content[this.addFigureInBlock].path_figure = '<iframe  src="https://ec2-18-220-172-58.us-east-2.compute.amazonaws.com/sample-apps/table/?showcase=0" style="border: 1px solid #AAA; width:100%; height:500px;"></iframe>'
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

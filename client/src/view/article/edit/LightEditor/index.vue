<template>
  <div class="components-container-article">
  <el-card style='box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding-bottom:100px'>
      <main class="article" id="article-page">
        <article>
          <span id="triggerStartNav"></span>
            <header>
                <el-row v-if="postForm.status == 'Reviewing'">
                    <el-button style=' width:100%; background-color:#FFEEAD; height:4rem; text-align:center; color:#333333; font-family:Arial; font-size:1.2rem;font-weight:bold; margin:0px 0px 10px 0px; border-style: none;'>{{postForm.status}} in progress</el-button>
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
                <div class='connectedUser'><div id="id-users-list"></div></div>
                <h1>
                  <form name="article_title_form">
                    <textarea-autosize
                      placeholder="Article Title"
                      ref="TitleTextArea"
                      v-model="postForm.title"
                      :min-height="30"
                      :cols="35"
                      :max-height="350"
                      @input="save($event)"
                    ></textarea-autosize>
                    <br>
                  </form>
               </h1>
                <div class="article-author">
                  <el-button icon="el-icon-plus" class="add-collaborator-buttons" type="success" @click="dialogTableVisible = true" title="Invite another author" circle v-on:click="diagAuthorVisible=true"></el-button>
                  <img  v-for="item in postForm.authors" :src="item.author.avatar"></img>
                    <p>
                        <a v-for="item_author in postForm.authors" href="#" title="author">{{item_author.author.firstname}} {{item_author.author.lastname}}, </a>
                    </p>
                    <div>
                      <span id="id-cursors-socket-indicator" class='socket-indicator'></span>
                      <span id="id-cursors-socket-state" class='socket-state'></span>
                    </div>
                </div>

                <div class="article-tag">
                    <a v-for="item in postForm.tags" href="#" title="Search more articles with this tag" ><h4>{{item}}</h4></a>
                    <div v-show='inputTagsVisible==true'><el-input placeholder="add a new tag" v-model="newTag" @keyup.enter.native="addNewTag($event)"></el-input></div>
                    <a @click="inputTagsVisible=true"><h4 style='font-size:1.4rem'>+</h4></a>
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
                    <input type="text" v-model="item.title" name="title" placeholder="Title 1" @input="save($event)" ><br>
                  </h2>
                  <transition v-on:enter="enter" v-on:leave="leave">
                  <div class="accordion-panel" v-show="item.display">

                    <div v-for='(subblock,subkey) in item.block' v-bind:data="subblock" v-bind:key="subkey">
                      <el-row :gutter='20' v-if='subblock.length==2' style='margin-bottom:10px'>

                        <el-col :span='12' v-for="(subitem,subsubkey) in subblock"  v-bind:data="subitem" v-bind:key="subsubkey">

                          <quill-editor v-if="subitem.type=='text'"  v-bind:numBlock='key' v-bind:numSubBlock='subkey' v-bind:numSubSubBlock='subsubkey' v-bind:uuid='subitem.uuid' v-bind:content="subitem.content" v-on:edit='applyTextEdit' v-on:delete='removeBlock($event,key,subkey,subsubkey)' v-on:comment='createComment'></quill-editor>
                          <figureComponent v-if="subitem.type=='chart'" :idfigure="subitem.uuid" :key='subitem.nbEdit' v-on:edit='editChartBlock($event,key,subkey,subsubkey,subitem.uuid)' v-on:delete='removeBlock($event,key,subkey,subsubkey)'/>
                          <imageComponent v-if="subitem.type=='image'" :idfigure="subitem.uuid" :key='subitem.nbEdit'/>
                          <el-card v-if="subitem.type=='tbd'" shadow="never" style='text-align: center'>
                            <div class= 'section-block'>
                              <div class="btn-group">
                                <el-button title="Add text" v-on:click="addTextBlock($event,key,subkey,subsubkey)"  circle><svg-icon icon-class='align-to-left'/></el-button>
                                <el-button title="Add chart" v-on:click="addChartBlock($event,key,subkey,subsubkey)" circle><svg-icon icon-class="chart-of-columns"/></el-button>
                                <el-button title="Add picture" v-on:click="addPictureBlock($event,key,subkey,subsubkey)"  circle><svg-icon icon-class="picture"/></el-button>
                                <el-button  type="warning" plain  icon="el-icon-delete" v-on:click="removeBlock($event,key,subkey,subsubkey)"circle/>
                              </div>
                            </div>
                          </el-card>
                        </el-col>
                      </el-row>
                      <el-row :gutter='20' v-if='subblock.length==1' style='margin-bottom:10px'>
                        <el-col :span='24' v-for="(subitem,subsubkey) in subblock"   v-bind:data="subitem" v-bind:key="subsubkey">
                          <quill-editor v-if="subitem.type=='text'" v-bind:numBlock='key' v-bind:numSubBlock='subkey' v-bind:numSubSubBlock='subsubkey' v-bind:uuid='subitem.uuid' v-bind:content="subitem.content" v-on:edit='applyTextEdit' v-on:delete='removeBlock($event,key,subkey,subsubkey)'  v-on:comment='createComment($event,uuid_comment)'></quill-editor>
                          <figureComponent v-if="subitem.type=='chart'" :idfigure="subitem.uuid" :key='subitem.nbEdit' v-on:edit='editChartBlock($event,key,subkey,subsubkey,subitem.uuid)' v-on:delete='removeBlock($event,key,subkey,subsubkey)'/>
                          <imageComponent v-if="subitem.type=='image'" :idfigure="subitem.uuid" :key='subitem.nbEdit'/>
                          <el-card v-if="subitem.type=='tbd'" shadow="never" style='text-align: center'>
                            <div class= 'section-block'>
                              <div class="btn-group">
                                  <el-button title="Add text" v-on:click="addTextBlock($event,key,subkey,subsubkey)" circle><svg-icon icon-class='align-to-left'/></el-button>
                                  <el-button title="Add chart" v-on:click="addChartBlock($event,key,subkey,subsubkey)" circle><svg-icon icon-class="chart-of-columns"/></el-button>
                                  <el-button title="Add picture" v-on:click="addPictureBlock($event,key,subkey,subsubkey)" circle><svg-icon icon-class="picture"/></el-button>
                                  <el-button  type="warning" plain  icon="el-icon-delete" v-on:click="removeBlock($event,key,subkey,subsubkey)"circle/>
                              </div>
                            </div>
                          </el-card>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  </transition>
                  <footer>
                    <div class='section-footer-right'>
                      <!--<el-button  type="info"  icon="el-icon-delete" v-on:click="removeRow($event,key)"circle/>-->
        					</div>
      						<div class='section-footer-left'>
                    <div class="btn-group">
                      <div id="main-icon" href='#'><el-button class="insert-buttons" icon="el-icon-plus "  title="Add a section" v-on:click="" circle></el-button></div>
                      <div id="second-icon"><el-button class="insert-buttons" title="Add a section" v-on:click="addNewRow($event,key)" circle><svg-icon icon-class='font'/></el-button></div>
                      <div id="second-icon"><el-button class="insert-buttons" title="Add 1 column" v-on:click="addOneBlock($event,key)" circle><svg-icon icon-class='layout-one-column'/></el-button></div>
                      <div id="second-icon"><el-button class="insert-buttons" title="Add 2 columns" v-on:click="addTwoBlocks($event,key)" circle><svg-icon icon-class='layout-two-columns'/></el-button></div>
                      <div id="second-icon"><el-button class="insert-buttons" type="warning" plain  icon="el-icon-delete" title='Delete all the section' v-on:click="removeRow($event,key)"circle/></div>
                    </div>
      						</div>
      					</footer>
              </section>
            </div>
            <span id="triggerEndNav"></span>
        </article>
    </main>

    </el-card>
    <aside  class="comments-reviews" ><p>Show comments &amp; reviews</p></aside>
    <aside type="button" class="content-comments-reviews" id="triggerAside">
      <reviewComponent :uuid='uuid_comment' v-on:changecomment='onChangeComment'/>
    </aside>

    <el-dialog
      title="Add collaborators"
      :visible.sync="diagAuthorVisible"
      width="70%">
    <addCollaborator v-bind:authors='postForm.authors' v-on:close="diagAuthorVisible=false"/>
    </el-dialog>

    <el-dialog
      show-close
      top="0"
      :visible.sync="diagInsertFigurePlotlyVisible"
      fullscreen
      width="100%"
      lock-scroll
      center>

      <span slot="title" class="dialog-header" >
        <div style='text-align:right;'>
          <el-button type="primary" @click="importDialogVisible=true">Import data</el-button>
          <el-button type=""  @click="diagInsertFigurePlotlyVisible=false" >Cancel</el-button>
          <el-button type="primary" @click="" >Preview</el-button>
          <el-button type="primary" @click="diagInsertFigurePlotlyVisible=false" >Insert Figure</el-button>
        </div>
      </span>
      <figureFactory :idfigure='editidfigure' :visible="diagInsertFigurePlotlyVisible" ref="lightChild"/>
    </el-dialog>

    <el-dialog
      show-close
      top="0"
      :visible.sync="diagInsertFigurePythonVisible"
      fullscreen
      width="100%"
      lock-scroll
      center>

      <span slot="title" class="dialog-header" >
        <div style='text-align:right;'>
          <el-dropdown trigger="click" @command="changePythonVersion">
            <el-button type="primary">Python version<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="3.5">Python 3.5</el-dropdown-item>
              <el-dropdown-item command="2.7">Python 2.7</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" @click="importDialogVisible=true">Import data</el-button>
          <el-button type=""  @click="diagInsertFigurePythonVisible=false" :loading="renderLoading">Cancel</el-button>
          <el-button type="primary" @click.prevent="execPythonCode" :loading="renderLoading">Preview</el-button>
          <el-button type="primary" @click="diagInsertFigurePythonVisible=false" :loading="renderLoading">Insert Figure</el-button>
        </div>
      </span>
      <scriptPython :idfigure='editidfigure' :visible="diagInsertFigurePythonVisible" ref="pythonChild"
                    v-on:loading="renderLoading=!(renderLoading)"/>
    </el-dialog>

    <el-dialog
      show-close
      top="0"
      :visible.sync="diagInsertFigureRVisible"
      fullscreen
      width="100%"
      lock-scroll
      center>

      <span slot="title" class="dialog-header" >
        <div style='text-align:right;'>
          <el-button type="primary" @click="importDialogVisible=true">Import data</el-button>
          <el-button type=""  @click="diagInsertFigureRVisible=false" :loading="renderLoading">Cancel</el-button>
          <el-button type="primary" @click="execRCode" :loading="renderLoading">Preview</el-button>
          <el-button type="primary" @click="diagInsertFigureRVisible=false" :loading="renderLoading">Insert Figure</el-button>
        </div>
      </span>
      <scriptR :idfigure='editidfigure' :visible="diagInsertFigureRVisible" ref="rChild"
               v-on:loading="renderLoading=!(renderLoading)"/>
    </el-dialog>

    <div id="container"></div>

    <el-dialog
      title="Insert data"
      :visible.sync="importDialogVisible"
      width="80%"
      top="0">
      <ImportData ref="importDataDialog"></ImportData>
    </el-dialog>

    <el-dialog
      title="Insert a figure"
      :visible.sync="dialogVisible"
      width="80%"
      top="0">
      <InsertFigure ref="insertFigureDialog"
                    v-on:changeStatusPythonDiag="(data) => { this.diagInsertFigurePythonVisible = data }"
                    v-on:changeStatusRDiag="(data) => { this.diagInsertFigureRVisible = data }"
                    v-on:changeStatusLightDiag="(data) => { this.diagInsertFigurePlotlyVisible = data }"
                    v-on:changeStatusMainDiag="(data) => { this.dialogVisible = data }"/>
    </el-dialog>

    <el-dialog
      title="Insert a picture"
      :visible.sync="dialogPictureVisible"
      width="80%"
      top="0">
      <span slot="title" class="dialog-header" >
        <div style='text-align:right;'>
          <el-button type=""  @click="dialogPictureVisible=false" >Cancel</el-button>
          <el-button type="primary" @click="dialogPictureVisible=false" >Insert Picture</el-button>
        </div>
      </span>

    <importImage ref="dialogPicture" v-on:edit='editPictureBlock' :numBlock='poseditfigure[0]' :numSubBlock='poseditfigure[1]' :numSubSubBlock='poseditfigure[2]' ></importImage>
  </el-dialog>
  </div>

</template>
<script>

  import editor from 'vue2-medium-editor'
  import { mapActions, mapGetters } from 'vuex'
  import MarkdownEditor from '../../../../components/MarkdownEditor'
  import axios from 'axios'
  import velocity from 'velocity-animate'
  import asideRightAnimation from '../../../../utils/js/animation/aside.right.js'
  import reviewComponent from '../../../../components/Review'
  import quilleditor from '../../../../components/QuillEditor'
  import VuePlotly from '@statnett/vue-plotly'
  import figureComponent from '../../../../components/Figure'
  import imageComponent from '../../../../components/Image'
  import importImage from '../../../../components/Image/ImportImage'
  import scriptPython from '../../../../components/ScriptPython'
  import scriptR from '../../../../components/ScriptR'
  import figureFactory from '../../../../components/Charts'
  import addCollaborator from '../../../../components/Collaborator'
  import ImportData from '../../../../components/ImportData/index'
  import InsertFigure from '../../../../components/InsertFigure/index'
  //import Zotero from '../../../../utils/zotero/include.js'
var Quill = require('quill');
var uuidv4 = require('uuid/v4');
// var Zotero = require('libzotero');

const defaultForm = {
  status: 'draft',
  title: '',
  abstract: '',
  content: '',
  currentData: [{
        x: ['Sample A','Sample B','Sample C','Sample D'],
        y: [ 10, 9, 12, 13],
        type: 'bar',
        orientation: 'v'
  }],
  options: {},
  layout: {
    title: 'Title',
    showlegend: false
  },
  arr_content: [{
                  name:"titre_1",
                  title:"Titre 1",
                  title_placeholder:"Titre 1",
                  block: [[{ type: 'text',uuid: '',content: 'Type your text'},{ type: 'chart',uuid: '',content: ''}]],
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
  components: {
    InsertFigure,
    ImportData,
    addCollaborator,importImage, imageComponent, figureComponent, VuePlotly, figureFactory, scriptPython, MarkdownEditor,'medium-editor': editor , reviewComponent, 'quill-editor' : quilleditor, scriptR},
  data() {
    return {
      timeoutId: Number,
      inputTagsVisible : false,
      newTag : '',
      cursors : Object,
      uuid_comment: '',
      zoteroitems: [],
      editidfigure: 0,
      poseditfigure: [0, 0, 0],
      postForm: {},
      loading: false,
      diagAuthorVisible : false,
      dialogVisible: false,
      diagInsertFigureRVisible: false,
      diagInsertFigurePythonVisible: false,
      diagInsertFigurePlotlyVisible: false,
      importDialogVisible: false,
      dialogPictureVisible: false,
      userListOptions: [],
      html: '',
      activeNames: ['1'],
      activeNames_section: ['1'],
      options: options,
      activeName_tab: 'article',
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      addFigureInBlock: 0,
      editorType: false,
      checkedExData1: false,
      checkedExData2: false,
      checkedExData3: false,
      renderLoading: false,
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
    }]
  }

  },
  computed: {
    ...mapGetters(['accessToken']),
    ...mapActions(['closeSideBar']),
    contentShortLength() {
      return this.postForm.content_short.length
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    //this.cursors = new Cursors('id-cursors-socket-indicator','id-cursors-socket-state',this.username)
    //this.cursors.update()

  },
  mounted() {
    this.fetchData(this.id)
    asideRightAnimation()
    //this.updateUserList()
    /*this.$watch(this.dialogVisible, (val) => {
      this.$refs.insertFigureDialog.setDialogStatus(val)
    })*/
  },
  watch: {
    diagInsertFigurePlotlyVisible (val) {
      if(val==false) {
        var idfigure = this.editidfigure
        this.$refs.insertFigureDialog.setDialogLightStatus(true)
        this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].nbEdit++
        console.log( 'diagInsertFigureVisible :: ' + this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].uuid);
        this.save(this.$event)
      }
    },
    diagInsertFigurePythonVisible (val) {
      if(val==false) {
        var idfigure = this.editidfigure
        this.$refs.insertFigureDialog.setDialogPythonStatus(true)
        this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].nbEdit++
        console.log( 'diagInsertFigureVisible :: ' + this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].uuid);
        this.save(this.$event)
      }
    },
    diagInsertFigureRVisible (val) {
      if(val==false) {
        var idfigure = this.editidfigure
        this.$refs.insertFigureDialog.setDialogRStatus(true)
        this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].nbEdit++
        console.log( 'diagInsertFigureVisible :: ' + this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].uuid);
        this.save(this.$event)
      }
    },
    diagAuthorVisible (val) {
      if(val==false) {
        axios.get('/api/articles/' + this.id , {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then(response => {
          this.postForm.authors = response.data.authors
        }).catch(err => {
          console.log(err)
        })
      }
    },
    dialogPictureVisible (val) {
      if(val==false) {
        //this.$ref.dialogPicture.reset()
        this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].nbEdit++
        console.log( 'dialogPictureVisible :: ' + this.postForm.arr_content[this.poseditfigure[0]].block[this.poseditfigure[1]][this.poseditfigure[2]].uuid);
        this.save(this.$event)

      }
    }
  },
  methods: {
    /*signalUpdateUserList (newCursors) {
      this.updateUserList (editor)
    },*/

    onChangeComment(commentStateVector) {
      this.$emit("changecomment",commentStateVector)
    },
    updateUserList (editor) {
      // Wipe the slate clean

      var usersListEl = document.getElementById('id-users-list');
      usersListEl.innerHTML = null;
      //var _cursors = this.cursors
      _cursors.connections.forEach(function(connection) {
        //var userItemEl = document.createElement('li');
        var userNameEl = document.createElement('div');
        var userParagraphEl = document.createElement('p');
        userNameEl.className = 'circle'
        //var userDataEl = document.createElement('div');

        userParagraphEl.innerHTML = connection.name.charAt(0) || 'A'
        //userNameEl.innerHTML = '<strong>' + (connection.name || '(Waiting for username...)') + '</strong>';
        //userNameEl.classList.add('user-name');

        if (connection.id == _cursors.localConnection.id) {
          userParagraphEl.innerHTML = _cursors.localConnection.name.charAt(0);
        }

        if (connection.range) {
          if (connection.id == _cursors.localConnection.id)
            connection.range = editor.getSelection();

          /*userDataEl.innerHTML = [
            '<div class="user-data">',
            '  <div>Index: ' + connection.range.index + '</div>',
            '  <div>Length: ' + connection.range.length + '</div>',
            '</div>'
          ].join('');*/
        } /*else
          userDataEl.innerHTML = '(Not focusing on editor.)';*/

        userNameEl.style.backgroundColor = connection.color;
        userNameEl.appendChild(userParagraphEl);
        usersListEl.appendChild(userNameEl);

      });
    },
    createComment (uuid_comment){
      // console.log('signal creation comment :',uuid_comment)
      $('aside.content-comments-reviews').css('display', 'block')
      this.uuid_comment = uuid_comment
      $('aside.content-comments-reviews section.reviews textarea').focus()

    },
    addNewTag (ev) {
      this.inputTagsVisible = false
      if (this.newTag !== '') {
        this.postForm.tags.push(this.newTag)
        this.save(ev)
      }
      this.newTag = ''

    },
    nextStep () {
        if (this.dialogStepActive++ > 2) this.dialogStepActive = 0;
    },
    previousStep () {
        if (this.dialogStepActive-- < 0 ) this.dialogStepActive = 0;
    },
    fetchData(id) {
      axios.get('/api/articles/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
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
      axios.put('/api/articles/'  + this.id, {
        "title": this.postForm.title,
        "abstract": this.postForm.abstract,
        "content": this.postForm.content,
        "arr_content": this.postForm.arr_content,
        "tags": this.postForm.tags,
        "published": true
      }, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })
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
        //this.save(ev);
        setTimeout(async ()=>{
          this.save(ev)
         },2000);
      }
    },
    applyTextEdit (editor, delta, source,key,subkey,subsubkey) {
      // this.postForm.arr_content[key].content =   editor.root.innerHTML
      this.postForm.arr_content[key].block[subkey][subsubkey].content = editor.root.innerHTML
      //this.save(this.$event)
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(async () => {
        this.save(this.$event)
       },2000);
      //this.updateUserList(editor)
    },
    addNewRow (ev,key) {
      var uuid_ = String(uuidv4())
      var uuid_block = String(uuidv4())
      var new_content = {
        name:"titre_1",
        uuid: uuid_,
        title:"Titre 1",
        title_placeholder:"Titre 1",
        content:"Type the text",
        block: [[{ type: 'tbd',uuid: uuid_block,content: ''}]],
        path_figure: "",
        display:true
      }
      this.postForm.arr_content.splice(key+1,0, new_content);
      this.save(ev)
    },
    addTextBlock (ev,key,subkey,subsubkey) {
      var uuid_block = String(uuidv4())
      var new_block = { type: 'text', uuid: uuid_block ,content: 'Type your text'}
      this.postForm.arr_content[key].block[subkey].splice(subsubkey,1,new_block);
      this.save(ev)
    },
    async addChartBlock (ev, key, subkey, subsubkey) {
      const idFigure = await this.createFigure()
      console.log("addChartBlock::idFigure: " + idFigure)
      var new_block = { type: 'chart', uuid: idFigure, content: 'New Figure', nbEdit: 0 }
      this.editidfigure = idFigure
      this.poseditfigure = [key, subkey, subsubkey]
      this.postForm.arr_content[key].block[subkey].splice(subsubkey, 1, new_block);
      this.openEditFigure()
    },
    addPictureBlock (ev,key,subkey,subsubkey) {
      var uuid_block = String(uuidv4())
      var new_block = { type: 'image', uuid: uuid_block, content: 'New Image',nbEdit:0}
      this.poseditfigure = [key, subkey, subsubkey]
      this.postForm.arr_content[key].block[subkey].splice(subsubkey,1,new_block);
      this.openEditPicture()
    },
    removeBlock (ev,key,subkey,subsubkey) {
      this.postForm.arr_content[key].block[subkey].splice(subsubkey,1);
      this.save(ev)
    },
    async editChartBlock (ev, key, subkey, subsubkey, idFigure) {
      this.editidfigure = idFigure
      this.poseditfigure = [key, subkey, subsubkey]
      const response = await axios.get('/api/figure/' + this.editidfigure, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      })
      if (response.data.script.language === 'Python') {
        this.diagInsertFigurePythonVisible = true
      } else if (response.data.script.language === 'R') {
        this.diagInsertFigureRVisible = true
      } else {
        this.diagInsertFigurePlotlyVisible = true
      }
    },
    editPictureBlock(key, subkey, subsubkey, idPicture) {
      console.log("editPictureBlock :: key :: ",key,subkey,subsubkey,idPicture)
      this.postForm.arr_content[key].block[subkey][subsubkey].uuid = idPicture
      this.postForm.arr_content[key].block[subkey][subsubkey].nbEdit++
      console.log("editPictureBlock :: ",this.postForm.arr_content[key].block[subkey][subsubkey])
      this.save(this.$event)
    },
    addOneBlock (ev,key) {
      var uuid_block = String(uuidv4())
      var new_block = [{ type: 'tbd',uuid: uuid_block,content: 'Type your text'}]
      this.postForm.arr_content[key].block.push(new_block);
      this.save(ev)
    },
    addTwoBlocks (ev,key) {
      var uuid_block_1 = String(uuidv4())
      var uuid_block_2 = String(uuidv4())
      var new_block = [{ type: 'tbd',uuid: uuid_block_1,content: 'Type your text'},{ type: 'tbd',uuid: uuid_block_2,content: 'Type your text'}]
      this.postForm.arr_content[key].block.push(new_block);
      this.save(ev)
    },
    removeRow (ev,key) {
      this.postForm.arr_content.splice(key, 1);
      this.save(ev)
      if(this.postForm.arr_content == ''){
        var uuid_block_1 = String(uuidv4())
        var new_content = {
          name:"titre_1",
          title:"Titre 1",
          title_placeholder:"Titre 1",
          block: [[{ type: 'tbd',uuid: uuid_block_1,content: ''}]],
          content:"Type the text",
          path_figure: "",
          display:true
        }
        this.postForm.arr_content.splice(key+1,0, new_content);
        this.save(ev)
      }

    },
    openEditFigure () {
      this.dialogVisible = true
    },
    openEditPicture () {
      this.dialogPictureVisible = true
    },
    async createFigure () {
      const newFigure = {
        data: [{
          x: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
          y: [10, 9, 12, 13],
          type: 'bar',
          orientation: 'v'
        }],
        option: {},
        layout: {
          title: 'Title',
          showlegend: false
        }
      };
      const response = await axios.post('/api/figure/', newFigure, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
      let _idFigure = response.data;
      console.log("createFigure::idFigure: " + _idFigure)
      return _idFigure
    },
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
    },
    async execPythonCode () {
      this.renderLoading = true
      await this.$refs.pythonChild.execCode()
      this.renderLoading = false
    },
    async execRCode () {
      this.renderLoading = true
      await this.$refs.rChild.execCode()
      this.renderLoading = false
    },
    changePythonVersion (newValue) {
      this.$refs.pythonChild.setVersion(newValue)
    }
  }
}
</script>
<style lang="scss">
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

.el-dialog--center .el-dialog__body{
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;

}
.icon-in-tab-pane{
  transform: translate(0px,5px);
}
.vue-plotly{

}

.socket-indicator {
  height: 10px;
  width: 10px;
  display: inline-block;
  margin-right: 5px;
  border-radius: 5px;
}
.socket-state {
  text-transform: capitalize;
}
.connectedUser {
  display: inline-block;
  float: right;
  position: inherit;
}

#users-panel ul > li {
  padding: 5px;
  border-radius: 5px;
  color: white;
  margin-bottom: 10px;
}
#users-panel .user-name {
  margin-bottom: 5px;
}
#users-panel .user-data {
  flex-wrap: wrap;
}
#users-panel .user-data > div {
  flex-grow: 1;
}

</style>
<!--<style>
@import "/node_modules/zotero-publications/lib/scss/zotero-publications.scss";
</style>-->

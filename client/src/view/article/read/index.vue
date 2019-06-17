<template>
  <div class="components-container-article">
    <el-card style='box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding-bottom:100px'>
      <main class="article">
          <article>
            <span id="triggerStartNav"></span>
              <header>
                  <!--<h2>Research article <span class="category grey">Physics</span></h2>-->
                  <el-row v-if="postForm.status == 'Reviewing'">
                      <el-button style=' width:100%; background-color:#FFEEAD; height:4rem; text-align:center; color:#333333; font-family:Arial; font-size:1.2rem;font-weight:bold; margin:0px 0px 10px 0px; border-style: none;'>{{postForm.status}} in progress</el-button>
                  </el-row>
                  <el-row v-else>
                    <h2>Research article <span class="category grey">{{postForm.status}}</span></h2>
                  </el-row>
                  <el-row ::guter='20'>
                    <div class="article-info">
                        <div class="article-info-item font-style-normal">Original article in <a href="#" title="See the original article in PLoS ONE plateform" target="_blank">PLoS ONE</a></div>
                        <div class="article-info-item green font-dnltp-bold font-style-normal"><time datetime="2017-11-03" pubdate="pubdate" >Published on 12/06/2018 </time></div>
                        <div class="article-info-item font-dnltp-bold font-style-bold">20 Reads</div>
                        <div class="article-info-item font-dnltp-bold font-style-bold">Cited 200 times</div>
                    </div>
                  </el-row>
                  <p class="article-doi">{{postForm.doi}}</p>
                  <h1>{{ postForm.title }} </i></h1>
                  <div class="article-author">
                    <img v-for="item in postForm.authors" :src="item.author.avatar"></img>
                      <p>
                          <a v-for="item in postForm.authors" href="#" title="author">{{item.author.firstname}} {{item.author.lastname}}, </a>
                      </p>
                  </div>

                  <div class="article-tag">
                      <a v-for="item in postForm.tags" href="#" title="Search more articles with this tag" ><h4>{{item}}</h4></a>
                  </div>
              </header>
              <section  class="abstract">
                  <h2>Abstract</h2><br>
                  {{postForm.abstract}}
              </section>

              <div v-for="(item,key) in postForm.arr_content">
                <section id="item.title">
                  <h2>
                    <i v-bind:class="['el-icon-arrow-down', { 'el-icon-arrow-right' : item.display }]"  @click="openItem(item)"> </i>
                    {{ item.title }}
                  </h2>
                  <transition v-on:enter="enter" v-on:leave="leave">
                    <div class="accordion-panel" v-show="item.display">
                      <div v-for='(subblock,subkey) in item.block' v-bind:data="subblock" v-bind:key="subkey">
                        <el-row :gutter='20' v-if='subblock.length==2' style='margin-bottom:10px'>
                          <el-col :span='12' v-for="(subitem,subsubkey) in subblock"  v-bind:data="subitem" v-bind:key="subsubkey">
                            <div v-if="subitem.type=='text'"><span v-html="subitem.content"></span></div>
                            <figureComponent v-if="subitem.type=='chart'" :idfigure="subitem.uuid" :key='subitem.nbEdit' v-on:edit='editChartBlock($event,key,subkey,subsubkey,subitem.uuid)'/>
                          </el-col>
                        </el-row>
                        <el-row :gutter='20' v-if='subblock.length==1' style='margin-bottom:10px'>
                          <el-col :span='24' v-for="(subitem,subsubkey) in subblock"   v-bind:data="subitem" v-bind:key="subsubkey">
                            <div v-if="subitem.type=='text'"><span v-html="subitem.content"></span></div>
                            <figureComponent v-if="subitem.type=='chart'" :idfigure="subitem.uuid" :key='subitem.nbEdit' v-on:edit='editChartBlock($event,key,subkey,subsubkey,subitem.uuid)'/>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </transition>
                </section>
              </div>

              <span id="triggerEndNav"></span>
          </article>
      </main>
    </el-card>
    <aside  class="comments-reviews" >
        <p>Show comments &amp; reviews</p>
    </aside>
    <aside type="button" class="content-comments-reviews" id="triggerAside">
          <reviewComponent/>
    </aside>
  </div>
</template>
<script>
import editor from 'vue2-medium-editor'
import { mapGetters } from 'vuex'
import MarkdownEditor from '../../../components/MarkdownEditor'
import { validateURL } from '../../../utils/validate'
import axios from 'axios'
import velocity from 'velocity-animate'
import asideRightAnimation from '../../../utils/js/animation/aside.right.js';
import VuePlotly from '@statnett/vue-plotly'
import figureComponent from '../../../components/Figure'
import reviewComponent from '../../../components/Review'

const debug = require('debug')('frontend')


const defaultForm = {
  status: 'draft',
  title: '',
  content: '',
  arr_content: [{
                  name:"titre_1",
                  title:"Titre 1",
                  title_placeholder:"Titre 1",
                  content:"Type the text",
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


export default {
  name: 'ArticleDetail',
  components: { figureComponent, VuePlotly,MarkdownEditor,reviewComponent },
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
      activeNames: ['1']
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'accessToken']),
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
      debug("creation de la page")
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // var bartab = new Toolbar('.bar-tab')
/*
    bartab.on('select', function(item) {
      console.log("ici")
      // item is the .tab-label innerText
    })
*/
    // function to highlight the text to comment
    /*
    $(function(){
    $(document.body).bind('mouseup', function(e){
        var selection;

        if (window.getSelection) {
          selection = window.getSelection();
          var range = selection.getRangeAt(0);
          var newNode = document.createElement("span");
          newNode.setAttribute("style", "background-color: #FFD34E;");
          range.surroundContents(newNode);
        } else if (document.selection) {
          selection = document.selection.createRange();
        }

        // selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);
      });
    });*/
/*
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var newNode = $(document).createElement("span");
    newNode.setAttribute("style", "background-color: pink;");
    range.surroundContents(newNode);
    */

  },
  mounted() {
      asideRightAnimation()
  },
  methods: {
    handleChange(val) {
      debug(val)
    },
    fetchData(id) {
      debug(id)
      axios.get('/api/articles/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
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
    },/*
    save (event) {
      axios.put('http://localhost:4000/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"content": this.postForm.content,"published": true })
      .then(response => {
        console.log("save successfully")
      })
      .catch(e => {
        console.log(e)
      })
    },
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

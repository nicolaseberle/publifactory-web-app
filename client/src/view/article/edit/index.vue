<template>
  <div class="components-container">
    <main class="article">
        <article>
          <span id="triggerStartNav"></span>
            <header>
                <h2>Research article <span class="category grey">Physics</span></h2>
                <div class="article-info">
                    <p class="font-style-normal">Original article in <a href="#" title="See the original article in PLoS ONE plateform" target="_blank">PLoS ONE</a></p>
                    <p class="green font-dnltp-bold font-style-normal"><time datetime="2017-11-03" pubdate="pubdate" >Published on 12/06/2018 </time></p>
                    <p class="font-dnltp-bold font-style-bold">20 Reads</p>
                    <p class="font-dnltp-bold font-style-bold">Cited 200 times</p>
                </div>
                <p class="article-doi">{{postForm.doi}}</p>
                <!--<h1>{{ postForm.title }} </i></h1>-->
                <h1>
                  <form name="article_title_form">
                    <!--<el-input
                      type="textarea"
                      :autosize="{ minRows: 1, maxRows: 5}"
                      v-model="postForm.title"
                      placeholder="Article Title" @input="save($event)"
                      >
                    </el-input>-->
                    <input type="text" v-model="postForm.title" name="title" placeholder="Article Title" @input="save($event)" ><br>
                  </form>
               </h1>
                <div class="article-author">
                  <button class="insert-buttons" title="Invite another author" ><span>+</span></button>
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
                <form name="abstract_form">
                  <medium-editor :text='postForm.abstract' :options='options' v-on:edit="save($event)"/>
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
                      <medium-editor  :text='item.content' :options='options' v-on:edit="applyTextEdit($event,key)" />
                    </form>
                    <span v-html="item.path_figure"></span>
                  </div>
                  </transition>
                  <footer>
      						<div class='section-footer-left'>
      								<button class="insert-buttons" title="Add a section" v-on:click="addNewRow($event,key)"><span>+</span></button>
      						</div>
      						<div class='section-footer-right'>
                    <el-button  type="info"  icon="el-icon-delete" v-on:click="removeRow($event,key)"circle/>
      					</div>
      					</footer>

              </section>
            </div>


            <span id="triggerEndNav"></span>
        </article>
    </main>
    <aside  class="comments-reviews" >
        <p>Show comments &amp; reviews</p>
    </aside>
    <aside type="button" class="content-comments-reviews" id="triggerAside">
        <div class="wrapper">
            <header class="wrapper">
                <a href="#" title="Check Reviews of the article" class="showreviews active"><i class="el-icon-edit-outline"/>10 reviews</a>
                <a href="#" title="Check Comments of the article" class="showcomments"><img src="/static/icons/Comment.svg" class="comments svg" alt="Comments of the article">12 comments</a>
                <a href="#" title="Close this side bar" class="close"><img src="/static/icons/Close.svg" class="close svg" alt="Close this side bar"></a>
            </header>
            <section class="content reviews">
                <article >
                    <header>
                        <a href="#" title="OSPR's profile">Nicolas Eberlé</a>
                        <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23">12/05/2018</time></p>
                    </header>
                    <section>
                        <!--<h2>commentaire</h2>-->
                        <p data-review="EDM-1">
                            Ceci est un commentaire
                        </p>
                    </section>
                    <footer >
                      <footer class="grid-header">
                      </footer>
                    </footer>
                </article>
            </section>
            <footer class="wrapper">
            </footer>
        </div>
    </aside>
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
  components: { MarkdownEditor, 'medium-editor': editor},
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
      activeNames: ['1'],
      activeNames_section: ['1'],
      options: options
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
    save (event) {
      axios.put('http://localhost:4000/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"arr_content": this.postForm.arr_content,"published": true })
      .then(response => {
        console.log("save successfully")
      })
      .catch(e => {
        console.log(e)
      })
    },
    applyTextEdit (ev,key) {
      console.log(ev)
      if (ev.event.target) {
        console.log(ev.event.target.innerHTML)
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
        display:true
      }
      //var new_content = {name: title_name,title: null,display:false,title_placeholder:title_name,content:"Type the text"}
      this.postForm.arr_content.splice(key+1,0, new_content);
      this.save(ev)
    },
    removeRow (ev,key) {
      this.postForm.arr_content.splice(key, 1);
      this.save(ev)
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

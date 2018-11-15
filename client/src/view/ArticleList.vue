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
                <h1>{{ postForm.title }} </i></h1>
                <div class="article-author">
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
                {{postForm.abstract}}
            </section>

            <div v-for="(item,key) in postForm.arr_content">
              <section id="item.title">
                  <h2 class="accordion-control-left">{{ item.title }}</h2>
                  <div class="accordion-panel">
                    <span v-html="item.content"></span>
                    <span v-html="item.path_figure"></span>
                  </div>
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
                <a href="#" title="Check Reviews of the article" class="showreviews active"><img src="/assets/images/icons/Book.svg" class="reviews svg" alt="Reviews of the article">10 reviews</a>
                <a href="#" title="Check Comments of the article" class="showcomments"><img src="/assets/images/icons/Comment.svg" class="comments svg" alt="Comments of the article">12 comments</a>
                <a href="#" title="Close this side bar" class="close"><img src="/assets/images/icons/Close.svg" class="close svg" alt="Close this side bar"></a>
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
import { mapGetters } from 'vuex'
import MarkdownEditor from '../components/MarkdownEditor'
import { validateURL } from '../utils/validate'
import { article as articleRes } from 'resources'
import axios from 'axios'


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
  components: { MarkdownEditor },
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
  methods: {
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
    save (event) {
      axios.put('http://localhost:4000/api/articles/'  + this.id, { "title": this.postForm.title,"abstract":this.postForm.abstract,"content": this.postForm.content,"published": true })
      .then(response => {
        console.log("save successfully")
      })
      .catch(e => {
        console.log(e)
      })
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

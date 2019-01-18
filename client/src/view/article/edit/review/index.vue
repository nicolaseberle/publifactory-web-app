<template>
  <div class="wrapper">
      <header class="wrapper">
          <a href="#" title="Check Reviews of the article" class="showreviews active"><i class="el-icon-edit-outline"/> {{article.nbReviews}} reviews</a>
          <a href="#" title="Check Comments of the article" class="showcomments"><img src="/static/icons/Comment.svg" class="comments svg" alt="Comments of the article"> {{article.nbComments}} comments</a>
          <a href="#" title="Close this side bar" class="close"><img src="/static/icons/Close.svg" class="close svg" alt="Close this side bar"></a>
      </header>
      <section class="content reviews">

          <article v-for="report in reports">
              <header>
                  <a href="#" title="OSPR's profile">{{ report.userId.firstname  }} {{ report.userId.lastname }}</a>
                  <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23">{{ report.creationDate  | moment("DD/MM/YYYY - LT") }}</time></p>
              </header>
              <section>

                  <p data-review="EDM-1">
                      {{ report.content}}
                  </p>
              </section>
              <footer >
                <!--<footer class="grid-header">
                </footer>-->

                <el-button type="success" icon="el-icon-arrow-up" circle></el-button>
                <el-button type="info"  icon="el-icon-arrow-down" circle></el-button>
                <el-button  icon="el-icon-share" style='float:right;' circle></el-button>

              </footer>
          </article>
          <article v-for="report in report_tmp">
              <header>
                  <a href="#" title="OSPR's profile">{{ username }}</a>
                  <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23"></time></p>
              </header>
              <section>

                  <p data-review="EDM-1">
                      {{ report.content}}
                  </p>
              </section>
              <footer >
                <!--<footer class="grid-header">
                </footer>-->

                <el-button type="success" icon="el-icon-arrow-up" circle></el-button>
                <el-button type="info"  icon="el-icon-arrow-down" circle></el-button>
                <el-button  icon="el-icon-share" style='float:right;' circle></el-button>

              </footer>
          </article>
          <el-row type="flex" class="row-bg" justify="center">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="Please input"
            v-model="editReport">
          </el-input>
          </el-row>
          <el-row type="flex" class="row-bg" justify="end">
            <el-button type="primary" style="margin-top: 2%;"  @click="createReport()" round>Submit your report</el-button>
          </el-row>
      </section>
      <footer class="wrapper">
      </footer>
  </div>

</template>
<script>
import locales from '../../../../locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'
import { report as reportRes } from 'resources'
import { article as articleRes } from 'resources'
import { user as userRes } from 'resources'

export default {
  name: 'reportComponent',
  locales,
  data () {
    return {
      activeName: 'first',
      reports : '',
      editReport: '',
      errors: {message: ''},
      article: '',
      report_tmp: []
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'userId',
      'roles'
    ])
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.id = id
    this.fetchReport(id)
    this.fetchArticle(id)
  },
  methods: {
    fetchReport(id) {
      axios.get('/api/comments/'  + id + '/comments').then(response => {
        this.reports = response.data
        this.errors.message = 'fetchReport success ';
      }).catch(err => {
        console.log(err)
        this.errors.message = 'fetchReport fails';
      })
    },
    fetchArticle(id) {
      console.log(id)
      articleRes.query({ _id: id }).then(response => {
        this.article = response.data
        // Just for test
        //this.postForm.title += `   Article Id:${this.postForm.id}`
        //this.postForm.content_short += `   Article Id:${this.postForm.id}`
      }).catch(err => {
        console.log(err)
      })
    },
    createReport() {
      let response__;
      console.log("createReport")
      var self = this;
      var now = new Date().getTime();
      const newComment = {
        date: now,
        userId : self.userId,
        content : String(this.editReport),
        commentFlag : false //it's a review
      };

      this.report_tmp.push(newComment)
      this.article.nbReviews = this.article.nbReviews + 1

      if (this.editReport) {
        this.editReport = '';
      }
      // this.$http.post(`/api/comment/${this.id}/comments`, newComment)
      axios.post('/api/comments/'  + this.id + '/comments', newComment)
      .then(response => {
        response__ = response.data;
        this.errors.message = 'createReport success ';
      })
      .catch(err => {
        this.errors.message = 'createReport fails';
      });
    }
  }
}
</script>

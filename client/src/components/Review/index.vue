<template>
  <div class="wrapper">
      <header class="wrapper">
          <a href="#" title="Check Reviews of the article" class="showreviews active"><i class="el-icon-edit-outline"/> {{article.nbReviews}} partial reviews</a>
          <a href="#" title="Check Comments of the article" class="showcomments"><img src="/static/icons/Comment.svg" class="comments svg" alt="Comments of the article" style="font-size:1.5rem;"><strong> {{article.nbComments}} global reviews</strong></a>
          <a href="#" title="Close this side bar" class="close"><img src="/static/icons/Close.svg" class="close svg" alt="Close this side bar"></a>
      </header>
      <section class="content reviews">

          <article v-for="(report,key) in reports">
              <header>
                  <a href="#" title="OSPR's profile">{{ report.userId.firstname  }} {{ report.userId.lastname }}</a>
                  <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23">{{ report.creationDate  | moment("DD/MM/YYYY - LT") }}</time></p>
                  <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23"></time></p>
                  <el-tag style="background-color:green; color:#f3f3f3" v-if="report.reviewRequest == 'No revision'" type="success">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:orange; color:#f3f3f3" v-if="report.reviewRequest == 'Minor revision'" type="warning">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:red; color:#f3f3f3" v-if="report.reviewRequest == 'Major revision'" type="danger">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:black; color:#f3f3f3" v-if="report.reviewRequest == 'Rejection'" type="danger">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:lightsteelblue; color:#333;font-family:'Calibri-bold' " v-if="report.reviewRequest == 'Simple comment'" type="danger">{{ report.reviewRequest }}</el-tag>
              </header>
              <section>
                <div class='card-review'>
                  <div class='col-vote'>
                    <div class='vote-icon'>
                      <!--<el-button plain type="" icon="el-icon-caret-top" circle></el-button>-->
                      <!--<i class='el-icon-caret-top'></i>-->
                      <div class="arrow-up"  v-on:click="upvoteComment($event,report._id,key)"></div>
                    </div>
                    <div class='vote-counter'>
                      {{report.scores.upvote}}
                    </div>
                    <div class='vote-icon'>
                      <!--<i class='el-icon-caret-bottom'></i>-->
                      <!--<el-button plain type="" icon="el-icon-caret-bottom" circle></el-button>-->
                      <div class="arrow-down" v-on:click="downvoteComment($event,report._id,key)"></div>
                    </div>
                  </div>
                  <div class='col-content'>
                    <div data-review="report.uuidComment" v-on:click="focusOnCommentedText($event,report.uuidComment)">
                      <p>
                          {{ report.content}}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <footer style='text-align: right'>
                <!--<footer class="grid-header">
                </footer>-->
                <!--<el-button plain type="success" icon="el-icon-arrow-up" circle></el-button>
                <el-button plain type="warning" icon="el-icon-arrow-down" circle></el-button>-->
                <el-button  icon="el-icon-share" circle></el-button>
                <el-button circle><font-awesome-icon icon="reply" /></el-button>
                <el-button type='warning' plain icon="el-icon-delete" style='float:right;' circle></el-button>
              </footer>
          </article>
          <article v-for="report in report_tmp">
              <header>
                  <a href="#" title="OSPR's profile">{{ username }}</a>
                  <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23"></time></p>
                  <el-tag style="background-color:green; color:#f3f3f3" v-if="report.reviewRequest == 'No revision'" type="success">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:orange; color:#f3f3f3" v-if="report.reviewRequest == 'Minor revision'" type="warning">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:red; color:#f3f3f3" v-if="report.reviewRequest == 'Major revision'" type="danger">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:black; color:#f3f3f3" v-if="report.reviewRequest == 'Rejection'" type="danger">{{ report.reviewRequest }}</el-tag>
                  <el-tag style="background-color:lightsteelblue; color:#333;font-family:'Calibri-bold' " v-if="report.reviewRequest == 'Simple comment'" type="danger">{{ report.reviewRequest }}</el-tag>
              </header>
              <section>
                <div class='card-review'>
                  <div class='col-vote'>
                    <div class='vote-icon'>
                      <!--<el-button plain type="" icon="el-icon-caret-top" circle></el-button>-->
                      <!--<i class='el-icon-caret-top'></i>-->
                      <div class="arrow-up" v-on:click="upvoteComment($event,report._id)"></div>
                    </div>
                    <div class='vote-counter'>
                      0
                    </div>
                    <div class='vote-icon'>
                      <!--<i class='el-icon-caret-bottom'></i>-->
                      <!--<el-button plain type="" icon="el-icon-caret-bottom" circle></el-button>-->
                      <div class="arrow-down" v-on:click="downvoteComment($event,report._id)"></div>
                    </div>
                  </div>
                  <div class='col-content'>
                    <div data-review="report.uuidComment" v-on:click="focusOnCommentedText($event,report.uuidComment)">
                      <p>
                          {{ report.content}}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <footer style='text-align: right'>
                <!--<footer class="grid-header">
                </footer>-->

                <!--<el-button plain type="success" icon="el-icon-arrow-up" circle></el-button>
                <el-button plain type="warning" icon="el-icon-arrow-down" circle></el-button>-->
                <el-button  icon="el-icon-share" circle></el-button>
                <el-button circle><font-awesome-icon icon="reply" /></el-button>
                <el-button type='warning' plain icon="el-icon-delete" style='float:right;' circle></el-button>

              </footer>
          </article>


          <el-card id="card-form-report">
          <el-row type="flex" class="row-bg" style="margin: 5px 0 20px 0;align-items: center;">
            <el-checkbox v-model="checkedAnonymous"><svg-icon icon-class='private'/></el-checkbox>
            <el-select v-model="reviewRequest" justify="left" placeholder="No revision">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-button type="primary" style="margin-left: 5%; justify:end" @click="createReport()" >Submit your report</el-button>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
          <el-input
            type="textarea"
            :rows="7"
            placeholder="Please input"
            v-model="editReport">
          </el-input>
          </el-row>
          </el-card>
      </section>
      <!--<footer class="wrapper">
      </footer>-->
  </div>

</template>
<script>
import locales from '../../locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee,faReply } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import hightlightText from '../../utils/js/animation/highlight.js';
import asideRightAnimation from '../../utils/js/animation/aside.right.js';

library.add(faCoffee,faReply)

export default {
  name: 'reportComponent',
  locales,
  components: {'font-awesome-icon': FontAwesomeIcon},
  props: ['uuid'],
  data () {
    return {
      checkedAnonymous: false,
      activeName: 'first',
      reports : '',
      editReport: '',
      errors: {message: ''},
      article: '',
      report_tmp: [],
      options: [{
          value: 'No revision',
          label: 'No revision'
        }, {
          value: 'Minor revision',
          label: 'Minor revision'
        }, {
          value: 'Major revision',
          label: 'Major revision'
        }, {
          value: 'Rejection',
          label: 'Rejection'
        }, {
          value: 'Simple comment',
          label: 'Simple comment'
        }],
        reviewRequest: 'Simple comment'
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'userId',
      'roles'
    ])
  },
  watch: {
    checkedAnonymous (val) {
      if(val==true){
        $("#card-form-report").css('background-color','purple');
      }else{
        $("#card-form-report").css('background-color','transparent');
      }

    }

  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.id = id
    this.fetchReport(id)
    this.fetchArticle(id)
  },
  mounted () {
    asideRightAnimation()
  },
  methods: {
    fetchReport(id) {
      axios.get('/api/comments/'  + id + '/comments').then(response => {
        this.reports = response.data
      }).catch(err => {
        console.log(err)
        this.errors.message = 'fetchReport fails';
      })
    },
    fetchArticle(id) {
      axios.get('/api/articles/' + id ).then(response => {
        this.article = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    createReport() {
      let response__;
      console.log("createReport : " , this.uuid)
      var self = this;
      var now = new Date().getTime();
      const newComment = {
        date: now,
        userId : self.userId,
        content : String(this.editReport),
        uuidComment: String(this.uuid),
        reviewRequest : String(this.reviewRequest),
        commentFlag : false //it's a review,
      };

      this.report_tmp.push(newComment)
      this.article.nbReviews = this.article.nbReviews + 1

      if (this.editReport) {
        this.editReport = ''
        this.reviewRequest = ''
      }
      axios.post('/api/comments/'  + this.id + '/comments', newComment)
      .then(response => {
        response__ = response.data;
        this.errors.message = 'createReport success ';
      })
      .catch(err => {
        this.errors.message = 'createReport fails';
      });
    },
    upvoteComment (ev,idComment,key) {
      console.log('upvoteComment')
      this.reports[key].scores.upvote = ++this.reports[key].scores.upvote
      axios.put('/api/comments/'  + this.id + '/comments/' + idComment,{"upvote": 1, "downvote": 0 , "userId":[this.userId]}).then(response => {
      }).catch(err => {
        console.log(err)
      })
    },
    downvoteComment (ev,idComment,key) {
      console.log('downvoteComment')
      this.reports[key].scores.downvote = ++this.reports[key].scores.downvote
      axios.put('/api/comments/'  + this.id + '/comments/' + idComment,{"upvote": 0, "downvote": 1 , "userId":[this.userId]}).then(response => {
      }).catch(err => {
        console.log(err)
      })
    },
    focusOnCommentedText (ev,idComment) {
      console.log('focusOnCommentedText')
      const markup = idComment
      const articleText = $("span[datareview='" + markup + "']")
      if (articleText.length > 0){
        console.log(articleText)
        var offset = 200
        var delay = 1000
        $('html, body').animate({
          scrollTop: $(articleText).offset().top - offset
        }, delay, 'swing')
      }

    }
  }
}
</script>
<style>
.card-review{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: auto;

}
.col-vote{
  margin-left: 10px;
  margin-right: 20px;
  text-align: center;
  align-items: center;
}
.vote-icon{
  text-align: center;
  display: block;
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
.vote-counter{
  display: block;
  text-align: center;
  color: #8E9FBB;
  font-size: 1.2rem;
  font-family: 'DNLTPro-regular';
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.col-content{
  width:100%;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-bottom: 15px solid #8E9FBB;
}
.arrow-up:hover {
  border-bottom: 15px solid #475069;
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-top: 15px solid #8E9FBB;
}
.arrow-down:hover {
  border-top: 15px solid #475069;
}
</style>

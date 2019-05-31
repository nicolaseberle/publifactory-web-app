
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
                  <a v-if='report.anonymousFlag==false' href="#" title="OSPR's profile">{{ report.userId.firstname  }} {{ report.userId.lastname }}</a>
                  <a v-if='report.anonymousFlag' href="#" title="OSPR's profile">Reviewer 1</a>
                  <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23">{{ report.creationDate  | moment("DD/MM/YYYY - LT") }}</time></p>
                  <p class="font-dnltp-regular font-style-normal"><time datetime="2017-02-23"></time></p>
                  <el-tag class="no-revision" v-if="report.reviewRequest == 'No revision'" type="success">{{ report.reviewRequest }}</el-tag>
                  <el-tag class="minor-revision" v-if="report.reviewRequest == 'Minor revision'" type="warning">{{ report.reviewRequest }}</el-tag>
                  <el-tag class="major-revision" v-if="report.reviewRequest == 'Major revision'" type="danger">{{ report.reviewRequest }}</el-tag>
                  <el-tag class="rejection" v-if="report.reviewRequest == 'Rejection'" type="danger">{{ report.reviewRequest }}</el-tag>
                  <el-tag class="simple-comment" v-if="report.reviewRequest == 'Simple comment'" type="danger">{{ report.reviewRequest }}</el-tag>
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
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 10}"
                        placeholder="Please input"
                        v-model="report.content" :disabled='report.edit == false'>
                      </el-input>
                      <div v-if='selectedComment==key'>{{report.edit}}</div>
                    </div>
                  </div>
                </div>
              </section>
              <footer style='text-align: right'>
                <!--<footer class="grid-header">
                </footer>-->
                <!--<el-button plain type="success" icon="el-icon-arrow-up" circle></el-button>
                <el-button plain type="warning" icon="el-icon-arrow-down" circle></el-button>-->
                <el-button v-show='report.edit == false' icon="el-icon-share" circle></el-button>
                <el-button v-show='report.edit == false' circle><font-awesome-icon icon="reply" /></el-button>
                <el-button v-show='report.edit == true' icon="el-icon-close" type="primary" v-on:click='cancelComment(key)' circle ></el-button>
                <el-button v-show='report.edit == true' icon="el-icon-check" type="success" v-on:click='saveComment(key)' circle ></el-button>
                <el-button v-show='report.edit == false' icon="el-icon-edit" v-on:click='editComment(key)' circle ></el-button>
                <el-button type='warning' plain icon="el-icon-delete" style='float:right;' v-on:click='deleteComment(key)' circle></el-button>
              </footer>
          </article>



          <el-card id="card-form-report">

          <el-row v-show='checkedAnonymous' type="flex" class="row-bg" style="margin: 0px 0 5px 0;align-items: center;">

            <div style='font-family:"Calibri-bold";color:#f3f3f3;'>Anonymous peer review</div>
          </el-row>
          <el-row type="flex" class="row-bg" style="margin: 5px 0 20px 0;align-items: center;">
            <el-checkbox v-model="checkedAnonymous"><svg-icon icon-class='private'/></el-checkbox>
            <el-select v-model="reviewRequest" justify="left" placeholder="No revision">
              <el-option
                v-for="item in optionsReview"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-button type="primary" class='button-submit' style="margin-left: 5%; justify:end" @click="createReport()" icon="el-icon-upload2">Send your report</el-button>
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
      <section class="content comments">
        <el-collapse v-model="activeComments" accordion>
          <div v-for="t in Comments">
            <article>
              <section>
                <el-collapse-item :title="t.name" :name="t.id">

                  <div class="figure">
                    <vue-plotly :data="t.currentData" :layout="t.layout" :options="options" />
                  </div>
                    <div style='font-family:"Calibri";font-size:1rem'>
                      {{t.reviewContent}}
                    </div>

                </el-collapse-item>
              </section>
            </article>
          </div>
        </el-collapse>
        <article>
          <section>
            <div class="block">
              <span>Innovative:</span>
              <el-slider
                v-model="innovativescore"
                :step="20"
                show-stops>
              </el-slider>
              <span>Reproducibility:</span>
              <el-slider
                v-model="reproducibilityscore"
                :step="20"
                show-stops>
              </el-slider>
              <span>Writing:</span>
              <el-slider
                v-model="writingscore"
                :step="20"
                show-stops>
              </el-slider>
              <span>Rigorous:</span>
              <el-slider
                v-model="rigorousscore"
                :step="20"
                show-stops>
              </el-slider>
              <span>Statistic relevant:</span>
              <el-slider
                v-model="statisticrelevancescore"
                :step="20"
                show-stops>
              </el-slider>
              <span>Quality of biblio</span>
              <el-slider
                v-model="qualitybiblioscore"
                :step="20"
                show-stops>
              </el-slider>
            </div>
          </section>
        </article>
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
import VuePlotly from '@statnett/vue-plotly'
import asideRightAnimation from '../../utils/js/animation/aside.right.js';
var uuidv4 = require('uuid/v4');

library.add(faCoffee,faReply)

const layout_1 = {
  autosize: true,
  width: 400,
  height: 400,
  polar: {
    radialaxis: {
      visible: false,
      range: [0, 5]
    },
    angularaxis:{
      showline: false,
      rotation: 115
    }
  },
  showlegend: false
}
const layout_2 = {
  autosize: true,
  width: 400,
  height: 400,
  polar: {
    radialaxis: {
      visible: false,
      range: [0, 5]
    },
    angularaxis:{
      showline: false,
      rotation: 115
    }
  },
  showlegend: false
}

export default {
  name: 'reportComponent',
  locales,
  components: {'font-awesome-icon': FontAwesomeIcon, VuePlotly},
  props: ['uuid'],
  data () {
    return {
      qualitybiblioscore:0,
      statisticrelevancescore: 0,
      rigorousscore: 0,
      innovativescore: 0,
      reproducibilityscore: 0,
      writingscore: 0,
      form: {
        firstname: '',
        lastname: '',
        creationDate: ''
      },
      Comments: [{
        name: 'Summary report',
        id: '1',
        reviewContent: 'Reviewer 1 : This article describes a new approach to brief evolutions - Reviewer 2:This subject is close to the article of Albeck & Al.',
        "layout": layout_1,
        currentData: [{
          type: 'scatterpolar',
          r: [4, 5, 2, 1, 5, 4, 4, 4],
          theta: ['Reproducibility', 'Open Data', 'Quality of biblio','Statistic Relevance', 'Rigorous', 'Writing','Innovative', 'Reproducibility'],
          fill: 'toself',
          name: 'review 1'
        },
        {
          type: 'scatterpolar',
          r: [3, 4, 4, 2, 5, 4, 4, 3],
          theta: ['Reproducibility', 'Open Data', 'Quality of biblio','Statistic Relevance', 'Rigorous', 'Writing','Innovative', 'Reproducibility'],
          fill: 'toself',
          name: 'review 2'
        }]
      },
      {
        name: 'Reviewer 1',
        id: '2',
        reviewContent: 'This article describes a new approach to brief evolutions',
        "layout": layout_2,
        currentData: [{
          type: 'scatterpolar',
          r: [4, 5, 2, 1, 5, 4, 4, 4],
          theta: ['Reproducibility', 'Open Data', 'Quality of biblio','Statistic Relevance', 'Rigorous', 'Writing','Innovative', 'Reproducibility'],
          fill: 'toself',
          name: 'review 11'
        }]
      }/*,
      {
        name: 'Reviewer 2',
        id: '3',
        reviewContent: 'This subject is close to the article of Albeck & Al. He is',
        layout: layout,
        currentData: [
        {
          type: 'scatterpolar',
          r: [3, 4, 4, 2, 5, 4, 4, 3],
          theta: ['Reproducibility', 'Open Data', 'Quality of biblio','Statistic Relevance', 'Rigorous', 'Writing','Innovative', 'Reproducibility'],
          fill: 'toself',
          name: 'review 2'
        }]
      }*/],
      activeComments: ['1'],
      checkedAnonymous: false,
      activeName: 'first',
      reports : '',
      editReport: '',
      errors: {message: ''},
      article: '',
      report_tmp: [],
      optionsReview: [{
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
        reviewRequest: 'Simple comment',
        currentData: {},
        layout: {},
        options:  {},
        selectedComment: -1
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'roles',
      'accessToken'
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
    this.id = this.$route.params && this.$route.params.id
    this.fetchReport(this.id)
    this.fetchArticle(this.id)
  },
  mounted () {
    asideRightAnimation()
    axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => {
      this.form.email = response.data.email
      this.form.firstname = response.data.firstname
      this.form.lastname = response.data.lastname
      })

    this.currentData = [{
      type: 'scatterpolar',
      r: [4, 5, 2, 1, 5, 4, 4, 4],
      theta: ['Reproducibility', 'Open Data', 'Quality of biblio','Statistic Relevance', 'Rigorous', 'Writing','Innovative', 'Reproducibility'],
      fill: 'toself',
      name: 'review 1'
    },
    {
      type: 'scatterpolar',
      r: [3, 4, 4, 2, 5, 4, 4, 3],
      theta: ['Reproducibility', 'Open Data', 'Quality of biblio','Statistic Relevance', 'Rigorous', 'Writing','Innovative', 'Reproducibility'],
      fill: 'toself',
      name: 'review 2'
    }]
  },
  methods: {
    fetchReport(id) {
      axios.get('/api/comments/'  + id + '/comments', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        this.reports = response.data
        const _allReports = [];
        for (var i=0, _report; _report = this.reports[i]; i++){
          _report.edit = false;
          _allReports.push(_report);
        }
        this.reports = _allReports
      }).catch(err => {
        console.log(err)
        this.errors.message = 'fetchReport fails';
      })
    },
    fetchArticle(id) {
      axios.get('/api/articles/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
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
      this.form.creationDate = now
      if (this.uuid==''){
        this.uuid = String(uuidv4())
      }
      const newComment = {
        date: now,
        userId : self.userId,
        content : String(this.editReport),
        uuidComment: String(this.uuid),
        reviewRequest : String(this.reviewRequest),
        commentFlag : false, //it's a review,
        anonymousFlag: this.checkedAnonymous
      };
      this.uuid = ''
      this.checkedAnonymous = false

      this.report_tmp.push(newComment)
      this.article.nbReviews = this.article.nbReviews + 1

      if (this.editReport) {
        this.editReport = ''
        this.reviewRequest = ''
      }
      axios.post('/api/comments/'  + this.id + '/comment', newComment, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
      .then(response => {
        response__ = response.data;
        this.errors.message = 'createReport success ';
        this.fetchReport(this.id)
      })
      .catch(err => {
        this.errors.message = 'createReport fails';
      });
    },
    editComment (key) {
      this._originalComment = Object.assign({}, this.reports[key])
      this.reports[key].edit = true
      this.selectedComment = key
    },
    saveComment (key) {
      axios.put('/api/comments/'  + this.id + '/comments/' + this.reports[key].uuidComment + '/content',{'content':this.reports[key].content}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
        .then(response => {
      }).catch(err => {
        console.log(err)
      })
      this.reports[key].edit = false
      this.selectedComment = -1
    },
    cancelComment (key) {
      Object.assign(this.reports[key], this._originalComment)
      this.reports[key].edit = false
      this.selectedComment = -1
    },
    deleteComment (key) {
      this.$confirm(`This action will remove the selected comment forever, still going on?`, this.$t('confirm.title'), {
        type: 'warning'
      }).then(() => {
        axios.delete('/api/comments/'+this.id+'/comments/'+ this.reports[key].uuidComment, {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.removed')
          })
        this.fetchReport(this.id)
        })
      }).catch(() => {})
    },
    upvoteComment (ev,idComment,key) {
      console.log('upvoteComment')
      this.reports[key].scores.upvote = ++this.reports[key].scores.upvote
      axios.put('/api/comments/'  + this.id + '/comments/' + idComment,{"upvote": 1, "downvote": 0 , "userId":[this.userId]}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
        .then(response => {
      }).catch(err => {
        console.log(err)
      })
    },
    downvoteComment (ev,idComment,key) {
      console.log('downvoteComment')
      this.reports[key].scores.downvote = ++this.reports[key].scores.downvote
      axios.put('/api/comments/'  + this.id + '/comments/' + idComment,{"upvote": 0, "downvote": 1 , "userId":[this.userId]}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
        .then(response => {
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
.el-textarea.is-disabled .el-textarea__inner {
    background-color: white;
    border-color: white;
    color: #333;
    cursor: auto;
    font-family: 'Calibri-regular';
    font-size: 1.1rem;
    font-weight: normal;
    padding: 0px 9px;
}
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


.figure {
    width: 100%;
    height: auto;
    text-align: center;
    margin: 0 2px 0 2px;
    padding: 0 2px 0 2px;
}
.block{
  font-size: 1rem;
  font-family: 'DNLTPro-bold'
}
</style>

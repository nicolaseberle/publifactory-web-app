
<template>
  <div class="wrapper">
    <header class="wrapper">
      <a href="#" title="Check Reviews of the article" class="showreviews active">
        <i class="el-icon-edit-outline" />
        {{reports.length}} partial reviews
      </a>
      <a href="#" title="Check Comments of the article" class="showcomments">
        <img
          src="/static/icons/Comment.svg"
          class="comments svg"
          alt="Comments of the article"
          style="font-size:1.5rem;"
        />
        <strong>{{article.nbComments}} global reviews</strong>
      </a>
      <a href="#" title="Close this side bar" class="close">
        <img src="/static/icons/Close.svg" class="close svg" alt="Close this side bar" />
      </a>
    </header>
    <section class="content reviews">
      <partial-review-section
        v-if="reports"
        v-on:post="reload"
        :reviews="reports"
        :socket="socket"
        v-on:newReport="newReport"
        :articleId="id"
      ></partial-review-section>
    </section>
    <section class="content comments">
      <global-review-section></global-review-section>
    </section>
  </div>
</template>
<script>
import locales from '../../locales/article';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import partialReviewSection from './components/partial-review-section';
import globalReviewSection from './components/global-review-section';
import VuePlotly from '@statnett/vue-plotly';
import asideRightAnimation from '../../utils/js/animation/aside.right.js';

var uuidv4 = require('uuid/v4');

const debug = require('debug')('frontend');

library.add(faCoffee, faReply);

export default {
  name: 'reportComponent',
  locales,
  components: {
    'font-awesome-icon': FontAwesomeIcon,
    VuePlotly,
    partialReviewSection,
    globalReviewSection
  },
  props: ['uuid', 'socket'],
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        creationDate: ''
      },
      activeName: 'first',
      reports: [],
      editReport: '',
      editAnswer: '',
      errors: { message: '' },
      article: '',
      reviewRequest: 'Simple comment',
      currentData: {},
      layout: {},
      options: {},
      selectedComment: -1
    };
  },
  computed: {
    ...mapGetters(['userId', 'roles', 'accessToken'
    // , 'partialReviews'
    ])
  },

  async created() {
    // try {
    //   await this.fetchPartialReviews({
    //     articleId: this.articleId,
    //     accessToken: this.accessToken
    //   });
    // } catch (error) {
    //   console.log('COMP ACTIONS =>', error);
    // }

    // console.log('COMP=>GETTER', this.partialReviews);
    this.id = this.$route.params && this.$route.params.id;
    this.fetchReport(this.id);
    this.fetchArticle(this.id);
  },
  mounted() {
    this.socket.on('ADD_COMMENT', data => (this.reports = data.newReports));

    axios
      .get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
      .then(response => {
        this.form.email = response.data.email;
        this.form.firstname = response.data.firstname;
        this.form.lastname = response.data.lastname;
      });

    this.currentData = [
      {
        type: 'scatterpolar',
        r: [4, 5, 2, 1, 5, 4, 4, 4],
        theta: [
          'Reproducibility',
          'Open Data',
          'Quality of biblio',
          'Statistic Relevance',
          'Rigorous',
          'Writing',
          'Innovative',
          'Reproducibility'
        ],
        fill: 'toself',
        name: 'review 1'
      },
      {
        type: 'scatterpolar',
        r: [3, 4, 4, 2, 5, 4, 4, 3],
        theta: [
          'Reproducibility',
          'Open Data',
          'Quality of biblio',
          'Statistic Relevance',
          'Rigorous',
          'Writing',
          'Innovative',
          'Reproducibility'
        ],
        fill: 'toself',
        name: 'review 2'
      }
    ];
  },
  methods: {
    // ...mapActions(['fetchPartialReviews']),
    async fetchReport(id) {
      try {
        const response = await axios.get('/api/comments/list/' + id, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        });
        this.reports = response.data;

        const _allReports = [];
        let stateVector_ = {
          nbComment: 0,
          nbWarning: 0,
          nbDanger: 0,
          nbSolved: 0
        };
        for (var i = 0, _report; (_report = this.reports[i]); i++) {
          _report.edit = false;
          _report.flagToAnswer = false;
          _report.flagShowingComment = false;
          _allReports.push(_report);
          stateVector_.nbComment = stateVector_.nbComment + 1;
          if (_report.reviewRequest === 'Minor revision')
            stateVector_.nbWarning = stateVector_.nbWarning + 1;
          if (_report.reviewRequest === 'Major revision')
            stateVector_.nbDanger = stateVector_.nbDanger + 1;
          if (_report.reviewRequest === 'Resolved')
            stateVector_.nbResolved = stateVector_.nbResolved + 1;
        }

        this.reports = _allReports;
        this.$emit('changecomment', stateVector_);
      } catch (e) {
        console.log(e);
        this.errors.message = 'fetchReport fails';
      }
    },
    async fetchArticle(id) {
      const response = await axios.get('/api/articles/' + id, {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      this.article = response.data;
    },
    async reload() {
      await this.fetchReport(this.id);
    },
    async newReport(report) {
      console.log('newReportRoot', report);
      this.reports.push(report);
      this.socket.emit('NEW_COMMENT', {
        newReports: this.reports
      });
    }
  }
};
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
.card-review {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: auto;
}
.col-vote {
  margin-left: 10px;
  margin-right: 20px;
  text-align: center;
  align-items: center;
}
.vote-icon {
  text-align: center;
  display: block;
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
.vote-counter {
  display: block;
  text-align: center;
  color: #8e9fbb;
  font-size: 1.2rem;
  font-family: 'DNLTPro-regular';
  margin-left: 0px;
  height: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.col-content {
  width: 100%;
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-bottom: 15px solid #8e9fbb;
}
.arrow-up:hover {
  border-bottom: 15px solid #475069;
}
.arrow-down {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;

  border-top: 15px solid #8e9fbb;
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
.block {
  font-size: 1rem;
  font-family: 'DNLTPro-bold';
}
</style>

<template>
  <div class="app-container">
    <content-module name="articles">
      <div class="dashboard-tab">
        <div style="margin-top:20px;z-index:1000;">
          <el-tabs v-model="activeName">
            <el-tab-pane label="All" name="first">
              <dataTableStatus :articles="articles" />
            </el-tab-pane>
            <el-tab-pane label="Submited" name="second">
              <span slot="label">
                Submited
                <el-badge
                  v-if="articlesSubmit.length > 0"
                  :value="articlesSubmit.length"
                  lass="mark"
                />
              </span>
              <dataTableStatus
                :articles="articlesSubmit"
                v-on:assignReviewer="assignReviewer"
                v-on:assignAE="assignAE"
              >
                <template v-slot="actionButton">
                  <div></div>
                  <!-- <action-button v-bind:actions="[{name:'try', command: this.assignAE}]"></action-button> -->
                </template>
              </dataTableStatus>
            </el-tab-pane>
            <el-tab-pane label="in Reviewing" name="third">
              <span slot="label">
                Review
                <el-badge
                  v-if="articlesReview.length > 0"
                  :value="articlesReview.length"
                  lass="mark"
                />
              </span>
              <dataTableStatus
                :articles="articlesReview"
                v-on:assignReviewer="assignReviewer"
                v-on:assignAE="assignAE"
              />
            </el-tab-pane>
            <el-tab-pane label="Published" name="fourth">
              <span slot="label">
                Published
                <el-badge
                  v-if="articlePublish.length > 0"
                  :value="articlePublish.length"
                  lass="mark"
                />
              </span>
              <dataTableStatus
                :articles="articlePublish"
                v-on:assignReviewer="assignReviewer"
                v-on:assignAE="assignAE"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <el-dialog title="Add Reviewer" :visible.sync="flagAddReviewer" width="70%">
        <addReviewer
          v-if="flagAddReviewer"
          :idarticle="selectedArticleId"
          v-on:close="flagAddReviewer = false"
        />
      </el-dialog>
      <el-dialog title="Add Associate Editor" :visible.sync="flagAddAE" width="70%">
        <addAE v-if="flagAddAE" :idarticle="selectedArticleId" v-on:close="flagAddAE = false" />
      </el-dialog>
    </content-module>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import locales from '../../../locales/article';
import axios from 'axios';
import addReviewer from '../../../components/Reviewer';
import addAE from '../../../components/AE';
import dataTableStatus from './DataTableStatus';
import actionButton from '../components/action-button';

const debug = require('debug')('frontend');
var uuidv4 = require('uuid/v4');

export default {
  locales,
  data() {
    return {
      flagVisibleAddReviewer: false,
      flagAddAE: false,
      activeName: 'first',
      options: {
        value: 'option 1',
        lable: 'option 1'
      },
      search: {},
      form: {
        title: ''
      },
      rules: {
        title: [
          {
            required: true,
            message: this.$t('article.rules.title'),
            trigger: 'blur'
          }
        ],
        abstract: [
          {
            required: true,
            message: this.$t('article.rules.abstract'),
            trigger: 'blur'
          }
        ]
      },
      notifications: { review: 0, submited: 0, published: 0 },
      articles: [
        {
          id: '',
          creationDate: '',
          title: '',
          address: '',
          status: '',
          authors: '',
          reviewers: ''
        }
      ],
      journalArticles: [],
      articlesSubmit: [],
      articlesReview: [],
      articlePublish: [],
      flagAddReviewer: false,
      selectedArticleId: ''
    };
  },
  computed: {
    ...mapGetters(['userId', 'accessToken', 'journalRoles'])
  },
  components: {
    dataTableStatus,
    addReviewer,
    addAE,
    actionButton
  },
  methods: {
    async fetchArticles() {
      await axios
        .get('/api/articles/', {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
        .then(list => {
          this.articles = list.data.articles.filter(d => d.status !== 'draft');
          this.articles.forEach(el => {
            if (el.status === 'submit') {
              this.notifications.submited++;
            }
            if (el.status === 'review') {
              this.notifications.review++;
            }
            if (el.status === 'publish') {
              this.notifications.published++;
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    assignReviewer(selectedArticleId) {
      console.log('assign reviewer');
      this.flagAddReviewer = true;
      this.selectedArticleId = selectedArticleId;
    },
    assignAE(selectedArticleId) {
      console.log('=====================');
      this.flagAddAE = true;
      this.selectedArticleId = selectedArticleId;
    },
    async fetchArticlesInPreprint() {
      const response = await axios.get('/api/journals/articles/', {
        params: {
          title: 'Preprint Collection',
          page: 1,
          count: 20
        },
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      this.articles = response.data.content.map(article => article.reference);
    },
    async fetchArticlesInJournal(journalId) {
      const response = await axios.get(`/api/journals/articles/${journalId}`, {
        params: {
          page: 1,
          count: 20
        },
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      const { users, content, ...journal } = response.data;
      return response.data.content.map(article => {
        return { ...article.reference, journal };
      });
    }
  },
  async mounted() {
    try {
      await this.fetchArticlesInPreprint();
      await Promise.all(
        this.journalRoles.map(async role => {
          this.journalArticles.push(
            ...(await this.fetchArticlesInJournal(role.id_journal))
          );
        })
      );
      this.journalArticles.map(article => {
        switch (article.status) {
          case 'submit':
            this.articlesSubmit.push(article);
            break;
          case 'review':
            this.articlesReview.push(article);
            break;
          case 'publish':
            this.artilesPublish.push(article);
            break;
          default:
            break;
        }
      });
    } catch (error) {
      console.warn(error);
    }
  }
};
</script>
<style>
.dashboard-tab {
  padding-top: 20px;
}

.tabs,
.el-tabs__nav {
  padding-top: 10px;
}
.el-table__header-wrapper {
  white-space: pre-line;
}
.el-tabs__item {
  width: 120px;
}
</style>

<template>
  <div>
    <data-table ref="articles" @page-change="fetchArticles">
      <el-table
        :data="articles"
        @row-click="setSelectedRow"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column class-name="date-col" width="140px" label="Date">
          <template slot-scope="scope">
            <span>{{ scope.row.creationDate | moment('DD/MM/YYYY') }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="300px" label="Title">
          <template slot-scope="scope">
            <router-link :to="'/articles/' + scope.row.id" class="link-type">
              <span>{{ scope.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column min-width="300px" label="Journal">
          <template slot-scope="scope">
            <span>{{scope.row.journal ? scope.row.journal.title : 'Preprint Collection'}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="author-col" width="120px" label="Author">
          <template slot-scope="articles">
            <div v-if="articles.row.authors.length">
              <div v-for="item_author in articles.row.authors">
                <div v-if="item_author.author">
                  {{ item_author.author.firstname }}.
                  {{ item_author.author.lastname }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="author-col" width="120px" label="Ass. Editor">
          <template slot-scope="articles">
            <div v-for="associate_editor in articles.row.associate_editor">
              <div v-if="associate_editor">
                {{ associate_editor.firstname }}.
                {{ associate_editor.lastname }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="author-col" width="120px" label="Reviewer">
          <template slot-scope="articles">
            <div
              v-if="articles.row.reviewers.length > 0"
              v-for="reviewer in articles.row.reviewers"
            >
              <div v-if="reviewer">
                <span style="white-space: pre;">{{ reviewer.firstname[0] }}. {{ reviewer.lastname }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="doi-col" label="DOI" width="50">
          <template v-if="scope.row.doi" slot-scope="scope">
            <i class="el-icon-check"></i>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" width="110">
          <template slot-scope="scope">
            <el-tag
              class-name="el-tag-status"
              :type="scope.row.status | statusFilter"
            >{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column class-name="action-col" label="Actions" width="120">
          <!-- <slot name="actionButton">Empty</slot> -->
          <div>toto</div>
          <!-- <action-button v-bind:actions="actions"></action-button> -->
        </el-table-column>
      </el-table>
    </data-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import DataTable from '../../../components/DataTable';
import locales from '../../../locales/article';
import axios from 'axios';
import addReviewer from '../../../components/Reviewer';
import actionButton from '../components/action-button';

export default {
  locales,
  props: {
    desiredstatus: String,
    articles: Array
  },
  data() {
    return {
      actions: [
        {
          command: this.actionOpenArticle,
          name: 'Open the Article'
        },
        {
          command: this.actionAssignAssociateEditor,
          name: 'Assign an associate editor'
        },
        {
          command: this.actionAssignReviewer,
          name: 'Assign a reviewer'
        },
        {
          command: this.actionSendEmailToAuthors,
          name: 'Send an email to authors'
        },
        {
          command: this.actionHistoricalActions,
          name: 'View historical actions'
        },
        {
          command: this.actionGetReferee,
          name: 'Referee'
        },
        {
          command: this.actionSurvey,
          name: 'Survey (Scopus, Google Scholar...)'
        }
      ],
      flagVisibleAddReviewer: false,
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
      formVisible: false,
      flagAddReviewer: false,
      selectedRow: '',
      selectedArticleId: ''
      // articles: [
      //   {
      //     id: '',
      //     creationDate: '',
      //     title: '',
      //     address: '',
      //     status: '',
      //     authors: '',
      //     reviewers: ''
      //   }
      // ]
    };
  },
  computed: {
    ...mapGetters(['userId', 'accessToken', 'journalRoles'])
  },
  components: {
    DataTable,
    addReviewer,
    actionButton
  },
  methods: {
    setSelectedRow(row, event, column) {
      this.selectedRow = row;
      this.selectedArticleId = row.id;
      console.log('setSelectedRow :: ', this.selectedArticleId);
    },
    actionOpenArticle() {
      this.$router.push({ path: `/articles/${this.selectedArticleId}` });
    },
    actionAssignAssociateEditor() {
      this.$emit('assignAE', this.selectedArticleId);
    },
    actionAssignReviewer() {
      this.$emit('assignReviewer', this.selectedArticleId);
    },
    async fetchArticlesInPreprint() {
      const response = await axios.get(
        '/api/journals/preprint/',
        {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        },
        {
          params: {
            page: 1,
            count: 2
          }
        }
      );
      if (this.desiredstatus === 'All') {
        this.articles = response.data.content.map(article => article.reference);
      }
    },
    async fetchArticlesInJournal() {
      const response = await axios.get(`/api/journals/`);
    },
    actionSendEmailToAuthors() {},
    actionHistoricalActions() {},
    actionGetReferee() {},
    actionSurvey() {},
    async fetchArticles() {
      await this.fetchArticlesInPreprint();
      await this.fetchArticlesInJournal();
      // axios
      //   .get('/api/articles/', {
      //     headers: { Authorization: `Bearer ${this.accessToken}` }
      //   })
      //   .then(list => {
      //     if (this.desiredstatus === 'All')
      //       this.articles = list.data.articles.filter(
      //         d => d.status !== 'draft'
      //       );
      //     else
      //       this.articles = list.data.articles.filter(
      //         d => d.status === this.desiredstatus
      //       );

      //     console.log(this.articles);
      //   })
      //   .catch(err => {
      //     console.error(err);
      //   });
    },
    closeCreationDialog() {
      this.formVisible = false;
    },
    cancelForm() {
      this.form.title = '';
      this.form.abstract = '';
      this.formVisible = false;
    },
    saveForm() {
      console.log('SAVE FORM=============');
      this.$refs.form.validate(valid => {
        if (valid) {
          articleRes
            .save(null, this.form)
            .then(() => {
              this.cancelForm();
              this.$message({
                type: 'success',
                message: this.$t('message.created')
              });
              this.fetchArticles();
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message:
                  err.status === 422
                    ? this.$t('article.action.articleExisted')
                    : this.$t('message.createFailed')
              });
            });
        }
      });
    }
  },
  async mounted() {
    console.log('datatable=>', this.articles);
    // this.fetchArticles();
    // console.log('----',this.journalRoles);
    // await this.fetchArticlesInPreprint();
  }
};
</script>

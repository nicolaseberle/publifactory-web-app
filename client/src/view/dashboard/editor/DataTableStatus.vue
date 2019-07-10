<template>
  <div>
    <data-table ref="articles" @page-change="fetchArticles" >
      <el-table :data="articles" @row-click="setSelectedRow" fit highlight-current-row style="width: 100%">
      <el-table-column class-name="date-col" width="140px" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.creationDate | moment("DD/MM/YYYY") }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px"  label="Title">
        <template slot-scope="scope">
          <router-link :to="'/articles/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column class-name="author-col" width="120px"  label="Author">
        <template slot-scope="articles">
          <div v-for="item_author in articles.row.authors">
            {{ item_author.author.firstname[0] }}. {{ item_author.author.lastname }}
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="author-col" width="120px"  label="Ass. Editor">
        <template slot-scope="articles">
          <div v-for="associate_editor in articles.row.associate_editor">
            {{ associate_editor.firstname[0] }}. {{ associate_editor.lastname }}
          </div>
        </template>
      </el-table-column>
      <el-table-column class-name="author-col" width="120px"  label="Reviewer">
        <template slot-scope="articles" >
          <div v-for="reviewer in articles.row.reviewers" >
              <span style="white-space: pre;">{{ reviewer.firstname[0] }}. {{ reviewer.lastname }}</span>
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
          <el-tag class-name="el-tag-status"  :type="scope.row.status | statusFilter" >{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="action-col"  label="Actions" width="120">
        <template slot-scope="scope">
          <!--<router-link :to="'/example/edit/'+scope.row.id">-->
            <!--<el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>-->
            <el-dropdown trigger="click" class="international" @command="actionHandleCommand">
              <div>
                <el-button class="el-button-action" icon="el-icon-more" circle>
                </el-button>
              </div>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item  command="settings" disabled>Access & settings</el-dropdown-item>
                <el-dropdown-item  command="openArticle">Open the article</el-dropdown-item>
                <el-dropdown-item  command="assignReviewer" >Assign a reviewer</el-dropdown-item>
                <el-dropdown-item  command="sendEmailToAuthors">Send an email to authors</el-dropdown-item>
                <el-dropdown-item  command="historicalActions">View historical actions</el-dropdown-item>
                <el-dropdown-item  command="referee">Referee</el-dropdown-item>
                <el-dropdown-item  command="survey">Survey (Scopus, Google Scholar...)</el-dropdown-item>
                <el-dropdown-item  command="remove" style="{color:'red'}" disabled>Remove the article</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <!--</router-link>-->
        </template>
      </el-table-column>
    </el-table>
    </data-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DataTable from '../../../components/DataTable'
import locales from '../../../locales/article'
import axios from 'axios'
import addReviewer from '../../../components/Reviewer'

export default {
  locales,
  props: {
    desiredstatus : String
  },
  data () {
    return {
      flagVisibleAddReviewer: false,
      activeName: 'first',
      options:{
        value:"option 1",
        lable:"option 1"
      },
      search: {
      },
      form: {
        title: ''
      },
      rules: {
        title: [{
          required: true, message: this.$t('article.rules.title'), trigger: 'blur'
        }],
        abstract: [{
          required: true, message: this.$t('article.rules.abstract'), trigger: 'blur'
        }]
      },
      formVisible: false,
      articles: [],
      flagAddReviewer: false
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  components: {
    DataTable,
    addReviewer
  },
  methods: {
    setSelectedRow (row, event, column) {
      this.selectedRow = row
      this.selectedArticleId = row.id
    },
    handleClick(tab, event) {
        console.log(tab, event);
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
        this.selectedArticleId = row.id
      },
    actionHandleCommand (action) {
      switch (action) {
        case 'settings':
          break;
        case 'openArticle':
          this.$router.push({ path: `/articles/${this.selectedArticleId}` })
          break;
        case 'assignReviewer':
          this.flagAddReviewer = true
          break;
      }
    },
    async fetchArticles (current = 1) {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      await axios.get('/api/articles/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(list => {
        if(this.desiredstatus === 'All')
          this.articles = list.data.articles.filter(d => d.status !== 'Draft')
        else
          this.articles = list.data.articles.filter(d => d.status === this.desiredstatus)

      }).catch(err => {
        console.error(err)
      })
    },
    closeCreationDialog () {
      this.formVisible = false
    },
    cancelForm () {
      this.form.title = ''
      this.form.abstract = ''
      this.formVisible = false
    },
    saveForm () {
      this.$refs.form.validate(valid => {
        if (valid) {
          articleRes.save(null, this.form).then(() => {
            this.cancelForm()
            this.$message({
              type: 'success',
              message: this.$t('message.created')
            })
            this.fetchArticles()
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err.status === 422 ? this.$t('article.action.articleExisted') : this.$t('message.createFailed')
            })
          })
        }
      })
    },
    deleteArticle (article) {
      this.$confirm(`This action will remove the selected article: ${article.title} forever, still going on?`, this.$t('confirm.title'), {
        type: 'warning'
      }).then(() => {
        articleRes.delete({ _id: article._id }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.removed')
          })
          this.fetchArticles()
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.fetchArticles()
  }
}
</script>

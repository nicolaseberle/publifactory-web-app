<template>
  <div class="app-container">
    <content-module name="articles">
      <data-table ref="articles" @page-change="fetch">
        <el-table :data="articles" fit highlight-current-row style="width: 100%">
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
            <div v-for="author in articles.row.authors">
              {{ author.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="author-col" width="120px"  label="Reviewer">
          <template slot-scope="articles" >
            <div v-for="reviewer in articles.row.reviewers" >
                <span style="white-space: pre;">{{ reviewer.name }}</span>
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
              <el-dropdown trigger="click" class="international">
                <div>
                  <el-button class="el-button-action" icon="el-icon-more" circle>
                  </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item  command="settings">Access & settings</el-dropdown-item>
                  <el-dropdown-item  command="openArticle">Open the article</el-dropdown-item>
                  <el-dropdown-item  command="assignReviewer">Assign a reviewer</el-dropdown-item>
                  <el-dropdown-item  command="sendEmailToAuthors">Send an email to authors</el-dropdown-item>
                  <el-dropdown-item  command="historicalActions">View historical actions</el-dropdown-item>
                  <el-dropdown-item  command="referee">Referee</el-dropdown-item>
                  <el-dropdown-item  command="survey">Survey (Scopus, Google Scholar...)</el-dropdown-item>
                  <el-dropdown-item  command="remove" style="{color:'red'}">Remove the article</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>


              </el-button>
            </el-select>
            <!--</router-link>-->
          </template>
        </el-table-column>
      </el-table>
    </data-table>
</content-module>
</div>
</template>
<script>
import moment from 'moment'
import DataTable from '../../../components/DataTable'
import { article as articleRes } from '../../../resources'
import locales from '../../../locales/article'

export default {
  locales,
  data () {
    return {
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
      articles: []
    }
  },
  components: {
    DataTable
  },
  methods: {
    fetch (current = 1) {
      this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
        this.articles = list.articles
        console.log(list)
      }).catch(err => {
        console.error(err)
      })
    },
    createArticle () {
      this.formVisible = true
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
            this.fetch()
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
          this.fetch()
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetch()
    })
  }
}
</script>

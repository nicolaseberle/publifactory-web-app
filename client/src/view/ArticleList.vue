<template>
  <content-module name="articles">
    <el-breadcrumb separator="/" style="margin-bottom:.5rem">
      <el-breadcrumb-item to="/dashboard">{{$t('article.breadcrumb.home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('article.breadcrumb.current')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <data-table ref="articles" @page-change="fetch">
      <div slot="toolbar">
        <el-button type="primary" icon="plus" @click.native="createArticle">{{$t('operation.create')}}</el-button>
      </div>
      <el-table :data="articles" border height="100%">
        <!--<el-table-column property="_id" label="ID" sortable min-width="20"></el-table-column>-->
        <el-table-column property="title" :label="$t('article.model.title')" sortable min-width="100"></el-table-column>
        <!--<el-table-column :label="$t('article.model.author')" sortable min-width="100">-->
        <el-table-column width="120px" align="center" label="Author">
          <template slot-scope="articles" >

            <tr v-for="author in articles.row.authors">
              <span style="white-space: pre;">{{ author.name }}</span>
            </tr>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="center" label="Reviewer">
          <template slot-scope="articles">
            <tr v-for="reviewer in articles.row.reviewers">
              <span style="white-space: pre;">{{ reviewer.name }}</span>
            </tr>
          </template>
        </el-table-column>
        <!--</el-table-column>-->
        <el-table-column :label="$t('operation.action')" align="center" width="120">
          <template scope="scope">
            <el-button type="text" @click.native="deleteArticle(scope.row)">{{$t('operation.remove')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </data-table>
    <el-dialog :title="$t('article.create.title')" v-model="formVisible" @close="cancelForm">
      <el-form :model="form" :rules="rules" ref="form"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form-item :label="$t('article.model.title')" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item :label="$t('article.model.abstract')" prop="abstract">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible=false">{{$t('confirm.cancel')}}</el-button>
        <el-button type="primary" @click.native="saveForm">{{$t('confirm.ok')}}</el-button>
      </span>
    </el-dialog>
  </content-module>
</template>
<script>
import DataTable from 'components/DataTable'
import { article as articleRes } from 'resources'
import locales from 'locales/article'
export default {
  locales,
  data () {
    return {
      search: {
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            published: 'success',
            draft: 'info',
            deleted: 'danger',
            rejected: 'danger'
          }
          return statusMap[status]
        }
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

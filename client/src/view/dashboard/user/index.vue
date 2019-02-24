<template>
  <div class="app-container">
    <div class="components-container-dashboard">
    <content-module name="articles">
      <el-row :gutter="20">
        <el-col :span='24'>
          <el-button-group>
          <el-button round v-on:click="createArticle()">Create Article</el-button>
          <el-button round v-on:click="importArticle()">Import</el-button>
        </el-button-group>
        </el-col>
      </el-row>
      <data-table ref="articles" @page-change="fetch" >
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
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item  command="settings">Access & settings</el-dropdown-item>
                  <el-dropdown-item  command="openArticle">Open the article</el-dropdown-item>
                  <el-dropdown-item  command="assignReviewer" >Assign a reviewer</el-dropdown-item>
                  <el-dropdown-item  command="sendEmailToAuthors">Send an email to authors</el-dropdown-item>
                  <el-dropdown-item  command="historicalActions">View historical actions</el-dropdown-item>
                  <el-dropdown-item  command="referee">Referee</el-dropdown-item>
                  <el-dropdown-item  command="survey">Survey (Scopus, Google Scholar...)</el-dropdown-item>
                  <el-dropdown-item  command="remove"><div style="color:'red'">Remove the article</div></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>


              </el-button>
            </el-select>
            <!--</router-link>-->
          </template>
        </el-table-column>
      </el-table>
    </data-table>
    <!-- Dialog Access Component-->
    <el-dialog
      title="Article settings"
      :visible.sync="diagAccessCompVisible"
      width="50%">
    <accessComponent v-if="diagAccessCompVisible" :idArticle='selectedArticleId' v-on:close="diagAccessCompVisible=false"/>
    </el-dialog>

</content-module>
</div>
<!--
<el-dialog :title="Titre" :visible.sync="formVisible">
  <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
      <el-form-item :label="$t('article.title')">
        <el-input v-model="temp.title"/>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeCreationDialog()" round>Cancel</el-button>
    <el-button type="primary" @click="dialogPvVisible = false" round>Validate</el-button>
  </span>
</el-dialog>-->
</div>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import DataTable from '../../../components/DataTable'
import locales from '../../../locales/article'
import axios from 'axios'
import accessComponent from '../../../components/AccessComponent'

var uuidv4 = require('uuid/v4');

export default {
  locales,
  data () {
    return {
      diagAccessCompVisible: false,
      selectedRow: '',
      selectedArticleId: '',
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
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  components: {
    DataTable,
    accessComponent
  },
  methods: {
    setSelectedRow (row, event, column) {
        this.selectedRow = row
        this.selectedArticleId = row.id
      },
    actionHandleCommand (action) {
      if(action=='settings'){
        this.diagAccessCompVisible = true
      }else if(action=='openArticle'){
        this.$router.push({ path: `/articles/${this.selectedArticleId}` })
      }
    },
    fetch (current = 1) {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      axios.get('/api/articles/').then(list => {
        this.articles = list.data.articles
      }).catch(err => {
        console.error(err)
      })
    },
    createArticle () {
      var uuid_block = String(uuidv4())
      //this.formVisible = true
      const newArticle = {
          title: String('Article title'),
          abstract:  String('abstract'),
          status: String('Draft'),
          arr_content: [{
                          name:"titre_1",
                          title:"Titre 1",
                          title_placeholder:"Titre 1",
                          block: [[{ type: 'tbd',uuid: uuid_block,content: ''}]],
                          content:"Type the text",
                          display:true
                        }],
          category : String('physics'),
          id_author : this.userId,
          published: true
        };
        axios.post('/api/articles/', newArticle)
        .then(response => {
          let new_article_id = response.data
          console.log("create successfully ")
          this.$router.push({ path: `/articles/${new_article_id}` }) // -> /user/123
        })
        .catch(e => {
          console.log(e)
        })
    },
    importArticle () {
      const h = this.$createElement;
              this.$message({
                message: h('p', null, [
                  h('span', null, 'Soon...')
                ])
              });
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

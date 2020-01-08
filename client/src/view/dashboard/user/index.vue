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
      <data-table ref="articles" :page="page" @page-change="nextPage" >
        <el-table :data="articles" @row-click="setSelectedRow" fit highlight-current-row style="width: 100%">
        <el-table-column class-name="date-col" width="140px" label="Date">
          <template slot-scope="scope">
            <span>{{ scope.row.creationDate | moment("DD/MM/YYYY") }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="260px" label="Title">
          <template slot-scope="scope">
            <router-link :to="'/articles/'+scope.row.id" class="link-type">
              <span>{{ scope.row.title }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column class-name="author-col" width="160px"  label="Author">
          <template slot-scope="articles">
            <div v-for="item_author in articles.row.authors">

              {{ item_author.author.firstname[0] }}. {{ item_author.author.lastname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="author-col" width="160px"  label="Reviewer">
          <template slot-scope="articles" >
            <div v-for="reviewer in articles.row.reviewers" >
                <span style="white-space: pre;">{{ reviewer.firstname[0] }}. {{ reviewer.lastname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="doi-col" label="DOI" width="60">
          <template v-if="scope.row.doi" slot-scope="scope">
            <i class="el-icon-check"></i>
          </template>

        </el-table-column>
        <el-table-column class-name="status-col" label="Status" width="120">
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
                  <el-dropdown-item  command="assignReviewer" disabled>Assign a reviewer</el-dropdown-item>
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
</div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import DataTable from '../../../components/DataTable'
  import locales from '../../../locales/article'
  import axios from 'axios'
  import accessComponent from '../../../components/AccessComponent'

  var uuidv4 = require('uuid/v4');
const debug = require('debug')('frontend')

export default {
  locales,
  data () {
    return {
      page: {current : 1,total:0,limit:10},
      diagAccessCompVisible: false,
      selectedRow: '',
      selectedArticleId: '',
      options:{
        value:"option 1",
        lable:"option 1"
      },
      search: {
      },
      formVisible: false,
      articles: [{
          id: '',
          creationDate: '',
          title: '',
          address: '',
          status: '',
          authors: '',
          reviewers: ''
        }]
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
    accessComponent
  },
  methods: {
    nextPage(val){
      this.page.current = val
      this.fetchMyArticles(this.page.current)
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
        this.selectedArticleId = row.id
      },
    actionHandleCommand (action) {
      if(action=='settings'){
        this.diagAccessCompVisible = true
      }else if(action=='openArticle'){
        this.$router.push({ path: `/articles/${this.selectedArticleId}` })
      }else if(action=='remove'){
        this.deleteArticle(this.selectedArticleId)
      }
    },
    async fetch (current = 1) {
      await axios.get('/api/articles/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(list => {
        this.articles = list.data.articles
      }).catch(err => {
        console.error(err)
      })
    },
    async fetchMyArticles (page=1) {
      await axios.get('/api/articles/mine?page='+page+'&limit=10', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(list => {
        this.articles = list.data.articles
        this.page.total = list.data.total  
        console.log("Nb articles : ",this.page.total)
      }).catch(err => {
        console.error(err)
      })
    },
    createArticle () {
      var uuid_block = String(uuidv4())
      const gen_text = `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage[english]{babel}
\\usepackage{multicol}

\\setcounter{secnumdepth}{2}

\\title{Title of the article}
\\author{Author's Name}
\\date{2019}

\\begin{document}

\\maketitle

\\begin{multicols}{2}
\\section{Titre 1}
\\subsection{Titre 1.1}


Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices sem sit amet massa semper condimentum. Nunc quis ipsum orci. Quisque diam augue, volutpat scelerisque dolor nec, porttitor rhoncus lorem. Cras rhoncus tristique dictum. Aliquam aliquet orci a tortor luctus interdum. Vivamus lacinia porttitor tellus ac euismod. Nullam tempor justo nulla, non molestie justo volutpat sed. Phasellus porttitor auctor mattis. Maecenas sit amet tincidunt elit, id consequat turpis. Vestibulum iaculis iaculis massa, nec convallis ipsum.

Suspendisse nec consequat lectus. Cras pellentesque felis non metus pulvinar, eu sodales felis mollis. Aenean purus mauris, vehicula id lacus ut, gravida faucibus quam. Ut vel felis erat. Pellentesque laoreet felis eu diam iaculis, et ornare est pharetra. Nam at nunc a arcu commodo maximus. Quisque consectetur lectus mollis volutpat congue. Phasellus rhoncus mi ac purus iaculis, ac suscipit dui interdum. Aenean eget neque nibh. Donec maximus ante ut dui lobortis ultrices. Duis finibus massa at maximus fermentum. Morbi lacinia fringilla purus at varius. Suspendisse consectetur vestibulum aliquam. Quisque convallis nunc vel vestibulum maximus. Donec rutrum venenatis risus sed sollicitudin.

\\end{multicols}
\\end{document}
      `
      const newArticle = {
        title: String('Article title'),
        abstract: String('abstract'),
        status: String('Draft'),
        arr_content: [{
          name: "titre_1",
          title: "Titre 1",
          title_placeholder: "Titre 1",
          block: [[{ type: 'tbd', uuid: uuid_block, content: '' }]],
          content: "Type the text",
          display: true
        }],
        content: gen_text,
        category: String('physics'),
        id_author: this.userId,
        published: true
      };
        axios.post('/api/articles/', newArticle, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
        .then(response => {
          let new_article_id = response.data
          debug("create successfully ")
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
            this.fetchMyArticles()
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err.status === 422 ? this.$t('article.action.articleExisted') : this.$t('message.createFailed')
            })
          })
        }
      })
    },
    deleteArticle (articleId) {
      this.$confirm(`This action will remove the selected article forever, still going on?`, this.$t('confirm.title'), {
        type: 'warning'
      }).then(() => {
        axios.delete('/api/articles/' + articleId, {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.removed')
          })
          this.fetchMyArticles()
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchMyArticles()
    })
  }
}
</script>

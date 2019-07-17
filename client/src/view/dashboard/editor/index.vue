<template>
  <div class="app-container">
    <content-module name="articles">
      <!--
      <el-row :gutter="20">
        <el-col :span='6'>
          <el-button-group>
            <el-button round v-on:click="createArticle()">Create Article</el-button>
            <el-button round v-on:click="importArticle()">Import</el-button>
          </el-button-group>
        </el-col>
      </el-row>-->
      <div class='dashboard-tab'>
      <div style='margin-top:20px;z-index:1000;'>
      <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="All" name="first">
        <dataTableStatus desiredstatus="All" v-on:assignReviewer="flagAddReviewer=true" v-on:assignAE="flagAddAE=true"/>
      </el-tab-pane>
      <el-tab-pane label="Submited" name="second">
        <span slot="label">Submited
          <el-badge v-if='notifications.submited>0' :value="notifications.submited" lass="mark"/>
        </span>
        <dataTableStatus desiredstatus="Submited" v-on:assignReviewer="flagAddReviewer=true" v-on:assignAE="flagAddAE=true"/>
      </el-tab-pane>
      <el-tab-pane label="in Reviewing" name="third">
        <span slot="label">Review<el-badge v-if='notifications.review>0' :value="notifications.review" lass="mark"/></span>
        <dataTableStatus desiredstatus="Reviewing" v-on:assignReviewer="flagAddReviewer=true" v-on:assignAE="flagAddAE=true"/>
      </el-tab-pane>
      <el-tab-pane label="Published" name="fourth">
        <span slot="label">Published<el-badge v-if='notifications.published>0' :value="notifications.published" lass="mark"/></span>
        <dataTableStatus desiredstatus="Published" v-on:assignReviewer="flagAddReviewer=true" v-on:assignAE="flagAddAE=true"/>
      </el-tab-pane>
  </el-tabs>
  </div>
  </div>
  <el-dialog
    title="Add Reviewer"
    :visible.sync="flagAddReviewer"
    width="70%">
    <addReviewer v-if="flagAddReviewer" :article_id="selectedArticleId" v-on:close="flagAddReviewer = false"/>
    <!--<span slot="footer" class="dialog-footer">
      <el-button v-on:click="flagAddReviewer=false" round>Cancel</el-button>
      <el-button type="primary" v-on:click="flagAddReviewer = false" round>Validate</el-button>
    </span>-->
  </el-dialog>
  <el-dialog
    title="Add Associate Editor"
    :visible.sync="flagAddAE"
    width="70%">
    <addAE v-if="flagAddAE" :article_id="selectedArticleId" v-on:close="flagAddAE = false"/>
    <!--<span slot="footer" class="dialog-footer">
      <el-button v-on:click="flagAddReviewer=false" round>Cancel</el-button>
      <el-button type="primary" v-on:click="flagAddReviewer = false" round>Validate</el-button>
    </span>-->
  </el-dialog>
</content-module>

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
import { mapGetters } from 'vuex'
import locales from '../../../locales/article'
import axios from 'axios'
import addReviewer from '../../../components/Reviewer'
import addAE from '../../../components/AE'
import dataTableStatus from './DataTableStatus'

const debug = require('debug')('frontend')
var uuidv4 = require('uuid/v4');

export default {
  locales,
  data () {
    return {
      flagVisibleAddReviewer: false,
      flagAddAE: false,
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
      notifications:{review:0,submited:0,published:0},
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
    dataTableStatus,
    addReviewer,
    addAE
  },
  methods: {
    /*
    createArticle () {
      var uuid_block = String(uuidv4())
      //this.formVisible = true
      const newArticle = {
          title: String('Article title'),
          abstract:  String('abstract'),
          status: 'Draft',
          arr_content: [{
                          name:"titre_1",
                          title:"Titre 1",
                          title_placeholder:"Titre 1",
                          block: [[{ type: 'text',uuid: uuid_block,content: 'Type your text'}]],
                          content:"Type the text",
                          display:true
                        }],
          category : String('Biology'),
          id_author : this.userId,
          published: true
        };
        axios.post('/api/articles/', newArticle, { headers: {'Authorization': `Bearer ${this.accessToken}`}})
        .then(response => {
          let new_article_id = response.data
          debug("create successfully ")
          this.$router.push({ path: `/articles/${new_article_id}` }) // -> /user/123
        })
        .catch(e => {
          console.log(e)
        })
    },*/
    async fetchArticles () {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      await axios.get('/api/articles/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(list => {
          this.articles = list.data.articles.filter(d => d.status !== 'Draft')
          this.articles.forEach((el)=>{
            if(el.status === 'Submited'){this.notifications.submited++}
            if(el.status === 'Reviewing'){this.notifications.review++}
            if(el.status === 'Published'){this.notifications.published++}
          })

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
    }
  },
  mounted () {
    this.fetchArticles()
  }
}
</script>
<style>
.dashboard-tab{
  padding-top:20px
}

.tabs, .el-tabs__nav{
    padding-top:10px
}
.el-table__header-wrapper{
  white-space: pre-line;
}
.el-tabs__item{
    width: 120px;
}
</style>

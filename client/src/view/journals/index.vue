<template>
  <div class="components-container-journal">
  <el-row :gutter="10" @page-change="fetch">
    <el-col :span="12">
      <div>
        <el-button round @click="flagCreateJournal=true" style="float:left;margin: 10px 10px 20px 10px; ">Create A Journal</el-button>
        <el-dialog title="Create journal" width="70%" :visible.sync="flagCreateJournal">
          <CreateJournal v-if="flagCreateJournal" @close="flagCreateJournal=false"></CreateJournal>
        </el-dialog>
      </div>
    </el-col>
    <el-col :span="10">
      <div style="width:100% ;margin-top:10px;">
        <el-autocomplete style='display: flex;'
          class="inline-input"
          v-model="state2"
          :fetch-suggestions="querySearch"
          placeholder="Search"
          :trigger-on-focus="false"
          @select="handleSelect"
        ><el-button slot="append" icon="el-icon-search"></el-button></el-autocomplete>
      </div>
    </el-col>
    <el-col :span="22" v-for="journal in journals" v-bind:data="journal" v-bind:key="journal._id">
      <el-card class="box-card"  style='margin-bottom:20px;'>
        <div slot="header" class="clearfix" style='text-align:left;margin-left:10px'>
          <a :href="'/journals/' + journal._id "><span>{{journal.title}}</span></a>
          <i class="ai ai-open-access ai-2x"></i>
          <el-button  v-on:click="handleCreateJournal()" type="info" style="float:right;">Submit your article</el-button>
        </div>
        <div class="body">
          <el-row :gutter="10">
            <el-col :span="4">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
              <g>
            <defs>
              <linearGradient :id=journal._id x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" v-bind:style="{'stop-color': journal.color_1 , 'stop-opacity':1}" />
                <stop offset="100%" v-bind:style="{'stop-color': journal.color_2 , 'stop-opacity':1}" />
              </linearGradient>
            </defs>
            <rect width="120" height="150" class="GradientBorder" :style="{'fill': 'url(#'+ journal._id + ')'}" />
            <rect x="10" y="10" width="100" height="130"  style="fill:url(#grad1);stroke-width:1;stroke:rgb(51,51,51)" />
            <text x="20" y="30" font-family="Calibri" font-size="11" fill="rgb(33,33,33)" >{{journal.title.split(" ")[0]}}</text>
            <text x="60" y="50" font-family="Calibri" font-size="11" fill="rgb(33,33,33)" >{{journal.title.split(" ")[1]}}</text>
            </g>
          </svg>
          </el-col>
          <el-col :span="12">
            <span style="margin-left: 5em;">{{journal.abstract}}</span>



          </el-col>
          <el-col :span="6" :offset="2">
            <strong>Created on : </strong>{{ journal.creationDate | moment("DD/MM/YYYY") }}
            <p><strong>Editor-In-Chief:</strong> <a v-for="item in journal.users" href="#" title="author">{{item.firstname}} {{item.lastname}}, </a></p>
            <p><strong>Associate Editor:</strong> </p>
          </el-col>
        </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-dialog :title="Warning" :visible.sync="dialogCreationJournal" center>
    Soon
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeCreationDialog()" round>Cancel</el-button>
      <el-button type="primary" @click="dialogCreationJournal = false" round>OK</el-button>
    </span>
  </el-dialog>
</div>




</template>



<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import locales from '../../locales/article'
import axios from 'axios'
import CreateJournal from '../../components/Journal/CreateJournal'

export default {
  locales,
  data () {
    return {
      rules: {
        title: [{
          required: true, message: this.$t('article.rules.title'), trigger: 'blur'
        }],
        abstract: [{
          required: true, message: this.$t('article.rules.abstract'), trigger: 'blur'
        }]
      },
      journals: [],
      dialogCreationJournal : false,
      links: [],
      state2: '',
      flagCreateJournal: false
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  components: {
    CreateJournal
  },
  mounted () {
    this.$nextTick(() => {
      this.fetch()
    })
    this.links = this.loadAll();
  },
  methods: {
    fetch (current = 1) {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      axios.get('/api/journals/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(list => {
        this.journals = list.data.journals
      }).catch(err => {
        console.error(err)
      })
    },
    loadAll() {
    // to do -> lister les journaux (this.journals) dans cette structure pour permettre l'autocompletion
        return [
          { "value": "vue", "link": "https://" },
          { "value": "Research", "link": "https://" },
          { "value": "journal of oncology", "link": "https://" },
          { "value": "journal of genetics", "link": "https://" }
         ];
    },
    handleSelect(item) {
      console.log(item);
    },
    handleCreateJournal () {
      this.dialogCreationJournal = true
    },
    closeCreationDialog () {
      this.dialogCreationJournal = false
    },
    querySearch(queryString, cb) {
      var links = this.links;
      var results = queryString ? links.filter(this.createFilter(queryString)) : links;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    createJournal () {

      const newJournal = {
          title: String('Journal title'),
          abstract:  String('Abstract'),
          category : String('Physics'),
          id_author : this.userId,
          published: true
        };/*
        axios.post('/api/articles/', newArticle)
        .then(response => {
          let new_article_id = response.data
          console.log("create successfully ")
          this.$router.push({ path: `/articles/${new_article_id}` }) // -> /user/123
        })
        .catch(e => {
          console.log(e)
        })*/
    }
  }
}

</script>
<style>
.el-card .el-card__header{
  background-color:white;
}
</style>

<template>
  <div class="components-container-journal">
  <el-row :gutter="10" @page-change="fetch">
    <el-col :span="12">
      <div>
        <el-button round @click="flagCreateJournal=true" style="float:left;margin: 10px 10px 20px 10px; " icon='el-icon-plus'>Create Collection</el-button>
        <el-dialog title="Create journal" width="70%" :visible.sync="flagCreateJournal">
          <CreateJournal v-if="flagCreateJournal" v-on:close="flagCreateJournal=false"></CreateJournal>
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
    <el-col :span="22" v-for="(journal,key) in journals" :key='changeState'>
      <el-card class="box-card"  style='margin-bottom:20px;'>
        <div slot="header" class="clearfix" style='text-align:left;margin-left:10px'>
          <a :href="'/journals/' + journal._id "><span>{{journal.title}}</span></a>
          <!--<i class="ai ai-open-access ai-2x"></i>-->
          <div style='float:right'>
            <el-button  v-on:click="handleCreateJournal()" type=""  round>Submit your article</el-button>
            <el-button v-show='journal.followed===false'  v-on:click="handleFollowJournal(key,journal._id)" type="" plain round>Follow the journal</el-button>
            <el-button v-show='journal.followed===true' v-on:click="handleUnFollowJournal(key,journal._id)" type="primary" plain round>Followed</el-button>
          </div>
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
</div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import locales from '../../locales/article'
  import axios from 'axios'
  import CreateJournal from '../../components/Journal/CreateJournal'

  export default {
  locales,
  data () {
    return {
      journals: [],
      followedJournals : [],
      dialogCreationJournal : false,
      links: [],
      state2: '',
      flagCreateJournal: false,
      changeState : 0
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
  created () {

  },
  mounted () {
    this.$nextTick(() =>  {
      var initializePromise = this.initialize()
      initializePromise.then( () => {
        this.fetch()
      });
    })
    this.links = this.loadAll();
  },
  methods: {
    initialize () {
      return new Promise((resolve, reject) => {
        axios.get('/api/journals/followed/all', {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then(list => {
          this.followedJournals = list.data.journals
          //console.log('intern function findFollowedJournals :: ',this.followedJournals)
          resolve(this.followedJournals);
        }).catch(err => {
          reject(err);
        })
      })
    },
    fetch () {
      axios.get('/api/journals/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(async list => {

        this.journals = list.data.journals
        this.journals = await  this.journals.map((item,key)=>{
          let journal = item;
          journal.followed = false;
          return journal;
        })
        //console.log('followedJournals :: ',this.followedJournals)
        for (let i = 0; i < this.journals.length; i++) {
          for (let j = 0; j< this.followedJournals.length; j++){

            if(this.journals[i]._id === this.followedJournals[j].id_journal._id )
            {
              this.journals[i].followed = true
            }
          }
        }
        console.log('journals :: ',this.journals)
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
        };

    },
    handleFollowJournal (key,idJournal) {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      axios.post('/api/journals/' + idJournal + '/follow', {}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(() => {
        this.journals[key].followed = true
        this.changeState = this.changeState + 1
        //console.log('handleFollowJournal :: ',this.journals[key].followed )
      }).catch(err => {
        console.error(err)
      })
    },
    handleUnFollowJournal (key,idJournal) {
      axios.post('/api/journals/' + idJournal + '/follow', {}, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(() => {
        this.journals[key].followed = false
        this.changeState = this.changeState + 1
        //console.log('handleFollowJournal :: ',this.journals[key].followed )
      }).catch(err => {
        console.error(err)
      })
    }
  }
}

</script>
<style>
.el-card .el-card__header{
  background-color:white;
}
</style>

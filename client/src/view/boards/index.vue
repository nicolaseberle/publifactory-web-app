<template>
  <div class="components-container-journal">
  <el-row :gutter="10" @page-change="fetch">
      <div>
        <el-button round @click="flagAddJournal=true" style="float:left;margin: 10px 10px 20px 10px; " icon='el-icon-plus'>Add Journal in my board</el-button>
        <el-dialog title="Add a Journal in my Board" width="50%" :visible.sync="flagAddJournal">
          <AddUserToJournal v-if="flagAddJournal" v-on:close="flagAddJournal=false"></AddUserToJournal>
        </el-dialog>
      </div>
    <el-col :span="22" v-for="(journal,key) in journals" :key='changeState'>

    </el-col>
  </el-row>
</div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import locales from '../../locales/article'
  import axios from 'axios'
  import AddUserToJournal from './components/AddUserToJournal'

  export default {
  locales,
  name: "EditorBoard",
  data () {
    return {
      journals: [],
      followedJournals : [],
      dialogCreationJournal : false,
      links: [],
      state2: '',
      flagAddJournal: false,
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
    AddUserToJournal
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

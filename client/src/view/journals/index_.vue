<template>
  <div>
    <el-col :span='6' style='border-right: 1px solid #e8e8e8;'>
      <div class='sidebar-wrap__panel'>
        <div class='journal-logo'>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="300px">
              <g>
            <defs>
              <linearGradient :id=journal._id x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" v-bind:style="{'stop-color': journal.color_1 , 'stop-opacity':1}" />
                <stop offset="100%" v-bind:style="{'stop-color': journal.color_2 , 'stop-opacity':1}" />
              </linearGradient>
            </defs>
            <rect width="240" height="300" class="GradientBorder" :style="{'fill': 'url(#'+ journal._id + ')'}" />
            <rect x="20" y="20" width="200" height="260"  style="fill:url(#grad1);stroke-width:1;stroke:rgb(51,51,51)" />
            <text x="40" y="50" font-family="Calibri" font-size="20" fill="rgb(33,33,33)" >{{journal.title.split(" ")[0]}}</text>
            <text x="80" y="70" font-family="Calibri" font-size="20" fill="rgb(33,33,33)" >{{journal.title.split(" ")[1]}}</text>
            </g>
        </svg>
      </div>
      <div class='journal-header'>
        <h1 class='title'>{{journal.title}}</h1>

        <div class='description'>
          <div class='block-with-text'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.
          </div>
          <el-button>Read All</el-button>
        </div>
        <div class='description'>
          <el-tag
            v-for="tag in journal.tags"
            :key="tag"
            type="info" style='margin-right:10px'>
            {{ tag }}
          </el-tag>
        </div>

        <div class='details'>
          <h2>Editor</h2>
          <div style='float: right;margin-bottom:3px'>
            <el-button  icon="el-icon-plus" size="mini" v-on:click='addEditor()' circle></el-button>
          </div>
          <li>
            <el-row>
              <div v-for='editor in editors'>{{editor.id_user.firstname}} {{editor.id_user.lastname}}</div>
            </el-row>
          </li>
        </div>
        <div class='details'>
          <h2>Associate Editors</h2>
          <div style='float: right;margin-bottom:3px'>
            <el-button  icon="el-icon-plus" size="mini" v-on:click='addAssociateEditor()' circle></el-button>
            <!--  <el-button style='margin-top:30px;' v-on:click="applyToJournal(journal._id)" type="primary" plain round mini>Apply</el-button>-->
          </div>
          <li>
            <el-row>
              <div v-if='associate_editors.length==0' style='color:#e8e8e8'>None</div>
              <div v-for='associate_editor in associate_editors'>{{associate_editor.id_user.firstname}} {{associate_editor.id_user.lastname}}</div>

            </el-row>
          </li>
        </div>
        <div class='details'>
          <h2>Monitoring Committee</h2>
          <div style='float: right;margin-bottom:3px'>
            <el-button  icon="el-icon-plus" size="mini" v-on:click='addMonitor()' circle></el-button>
            <!--  <el-button style='margin-top:30px;' v-on:click="applyToJournal(journal._id)" type="primary" plain round mini>Apply</el-button>-->
          </div>
          <li>
            <el-row>
              <div v-if='monitors.length==0' style='color:#e8e8e8'>None</div>
              <div v-for='monitor in monitors'>{{monitor.id_user.firstname}} {{monitor.id_user.lastname}}</div>

            </el-row>
          </li>
        </div>
        <div class='details'>
          <li>
            Licence: <a href='https://creativecommons.org/licenses/by-nd/4.0/'><u>CC BY-ND 4.0</u></a>
          </li>
          <li>
            Date: <span>{{ journal.creationDate | moment("DD/MM/YYYY") }}</span>
          </li>
          <li style='color:#a8a8a8'>ISSN : 2049-3630</li>
        </div>
        <div class='details'>
          <social-sharing
                  title="PubliFactory's journal | Checkout the web application to view every article from this journal! More info on http://publifactory.co"
                  description="Checkout the web application to view every article from this journal! More info on http://publifactory.co"
                  v-bind:hashtags="this.journal.title + ', publifactory'" inline-template>
            <div>
              <!--
              <li>
              <network network="facebook">
                <h3><img src="../../../static/img/facebook-button-sharing.png" alt="Facebook"/>
                 Facebook</h3>
              </network>
              </li>
              <li>
              <network network="linkedin">
                <h3><img src="../../../static/img/linkedin-button-sharing.png"
                     alt="linkedin"/> LinkedIn</h3>
              </network>
              </li>
              <li>
              <network network="reddit">
                <h3><img src="../../../static/img/reddit-button-sharing.png"
                     alt="Reddit"/> Reddit</h3>
              </network>
            </li>-->
              <li>
              <network network="twitter">
                <h3><img src="../../../static/img/twitter-button-sharing.png" alt="Twitter"/> Twitter</h3>
              </network>
              </li>
            </div>
          </social-sharing>
        </div>
        </div>
        <div class='footer'>
          <el-button v-on:click="removeJournal(journal._id)" type="danger" plain round>Remove journal</el-button>
      </div>
    </div>
    </el-col>
    <el-col :span='18'>
      <div class='container'>
      <div class='journal-list-articles'>
          <div class='entry' v-for='(item,index) in journal.content' :key='index' v-on:mouseover="flag=index" v-on:mouseleave="flag='-1'">
            <div class='visual'>

            </div>
            <div class='content'>
              <div class='title'>
                <router-link :to="'/articles/' + item.reference._id">
                  <span>{{item.reference.title}}</span>
                </router-link>
              </div>
              <el-tooltip class="item" effect="dark" content="Mark as read an hide" placement="top" >
                <button v-show='flag==index' class='hide' alt='Mark as read an hide'><i class="el-icon-close"></i></button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Mark as read" placement="top">
                <button v-show='flag==index' class='mark-as-read' alt='Mark as read'><i class="el-icon-check"></i></button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Save to board" placement="top">
                <button v-show='flag==index' class='save-to-board' alt='Save to board'><i class="el-icon-collection"></i></button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="Read Later" placement="top">
                <button v-show='flag==index' class='save-for-later' alt='Read Later'><i class="el-icon-collection-tag"></i></button>
              </el-tooltip>
              <div class='metadata'>
                <span v-for='el in item.reference.authors.list'>{{el}},</span>
              </div>
              <div class='summary'>
                {{item.reference.abstract}}
              </div>
            </div>
          </div>
      </div>
      </div>
    </el-col><!--
    <el-dialog
      title="Add Editors"
      :visible.sync="diagEditorVisible"
      width="70%">
    <addCollaborator v-bind:authors='editor' v-on:close="diagEditorVisible=false"/>
  </el-dialog>-->
    <el-dialog
      title="Add Associate Editors"
      :visible.sync="diagAssociateEditorVisible"
      width="70%">
    <addAssociateEditor v-on:close="diagAssociateEditorVisible=false"/>
  </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  import addAssociateEditor from '../../components/AssociateEditor'
  import SocialSharing from 'vue-social-sharing'
  import Vue from 'vue'

  Vue.use(SocialSharing)
  export default {
  components: {addAssociateEditor},
  data () {
    return {
      editor: '',
      isEditable: false,
      associateEditor: '',
      diagAssociateEditorVisible: false,
      diagEditorVisible: false,
      flag : false,
      test : 'on est sur la page du journal',
      journalId: '',
      journal: '',
      editors: '',
      associate_editors: '',
      monitors: '',
      articles: [
        {_id: '#MLKSdmlqjsdnml',
        title:'First report on the effective intraperitoneal therapy of insulin-dependent diabetes mellitus in pet dogs using “Neo-Islets”, aggregates of adipose stem and pancreatic islet cells',
        authors:'M. Zeeshan, F. Shilliday... C. A. Moores, R. Tewari',
        abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.'},
      {_id: '#mlqsdklmqdnnml',
      title:'Caveolae coupling of melanocytes signaling and mechanics is required for human skin pigmentation',
      authors:'M. Zeeshan, F. Shilliday... C. A. Moores, R. Tewari',
      abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.'},
      {_id: '#mlqsdklmqdnnml',
      title:'Plasmodium Kinesin-8X associates with mitotic spindles and is essential for oocyst development during parasite proliferation and transmission',
      authors:'M. Zeeshan, F. Shilliday... C. A. Moores, R. Tewari',
      abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.'},
      {_id: '#mlqsdklmqdnnml',
      title:'RanGTP induces an effector gradient of XCTK2 and importin α/β for spindle microtubule cross-linking',
      authors:'M. Zeeshan, F. Shilliday... C. A. Moores, R. Tewari',
      abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.'},
      {_id: '#mlqsdklmqdnnml',
      title:'A Single Cell Transcriptomic Atlas Characterizes Aging Tissues in the Mouse',
      authors:'M. Zeeshan, F. Shilliday... C. A. Moores, R. Tewari',
      abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.'},
      {_id: '#mlqsdklmqdnnml',
      title:'Caveolae coupling of melanocytes signaling and mechanics is required for human skin pigmentation',
      authors:'M. Zeeshan, F. Shilliday... C. A. Moores, R. Tewari',
      abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.'}
      ]
    }
  },
  computed: {
    ...mapGetters(['userId', 'accessToken'])
  },
  created (){
    this.journalId = this.$route.params && this.$route.params.id

  },
  mounted () {
    this.fetch()
    this.fetchEditor()
    this.fetchAssociateEditor()
  },
  watch: {
    diagAssociateEditorVisible () {
      this.fetchAssociateEditor()
      this.$forceUpdate();
    },
    addAssociateEditor () {
      this.fetchEditor()
      this.$forceUpdate();
    }
  },
  methods:{
    fetch () {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      axios.get('/api/journals/' + this.journalId, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(res => {
        this.journal = res.data
        this.journal.content.forEach((item)=>{
          let strInputCode = item.reference.abstract
          item.reference.abstract = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
          item.reference.authors.list = []
          item.reference.authors.forEach( (el)=>{
            // var x = setTimeout(()=>{item.reference.authors.list.push("Einstein")}, 100)
            console.log(el.author)
            axios.get('/api/users/' + el.author, {
              headers: {'Authorization': `Bearer ${this.accessToken}`}
            }).then(respond => {
              let _user = respond.data
              let str_user = `${_user.firstname[0].toUpperCase()}. ${_user.lastname.charAt(0).toUpperCase()}${_user.lastname.slice(1)}`
              item.reference.authors.list.push(str_user)
              this.$forceUpdate();
            })
          })

        })

      }).catch(err => {
        console.error(err)
      })
    },
    fetchEditor () {
      axios.get('/api/roles/journal/all/' + this.journalId + '/editor', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(res => {
        console.log('fetchEditor :: ', res.data)
        this.editors = res.data.users
      }).catch(err => {
        console.error(err)
      })
    },
    fetchAssociateEditor () {
      axios.get('/api/roles/journal/all/' + this.journalId + '/associate_editor', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(res => {
        console.log('fetchAssociateEditor :: ', res.data)
        this.associate_editors = res.data.users
      }).catch(err => {
        console.error(err)
      })
    },
    addEditor () {
      this.diagEditorVisible = true
    },
    addAssociateEditor () {
      this.diagAssociateEditorVisible = true
    },
    addMonitor () {

    },
    removeJournal(journal_id) {
      this.$confirm(`Are you sure to remove the journal and the collection of articles`, this.$t('confirm.title'), {
          type: 'warning'
        }).then(()=>{
          axios.delete('/api/journals/' + this.journalId + '/removeJournal', {
            headers: {'Authorization': `Bearer ${this.accessToken}`}
          }).then(res=>{
            this.$message({
              type: 'success',
              message: this.$t('message.removed')
            })
          })
          .catch(err=>{console.error(err)})

      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.sidebar-wrap__panel{
  margin: 40px;

.journal-logo{

  }
.journal-header {
  float: left;
  display: block;
  margin-top: 20px;
  h1.title{
      font-family: 'DNLTPro-bold';
      font-size: 1.4rem;
      line-height: 1.2rem;
      margin-bottom: 60px;
      word-break: break-word;
  }
  .description{
    margin-bottom: 30px;

    .block-with-text {
      font-family: 'DNLTPro-regular';
      width: 100%;
      float: left;
      /* hide text if it more than N lines  */
      overflow: hidden;
      /* for set '...' in absolute position */
      position: relative;
      /* use this value to count block height */
      line-height: 1.2em;
      /* max-height = line-height (1.2) * lines max number (3) */
      max-height: 6.0em;
      /* fix problem when last visible word doesn't adjoin right side  */
      text-align: justify;
      /* place for '...' */
      margin-right: -1em;
      padding-right: 1em;
      margin-bottom: 20px
    }
    /* create the ... */
    .block-with-text:before {
      /* points in the end */
      content: '...';
      /* absolute position */
      position: absolute;
      /* set position to right bottom corner of block */
      right: 0;
      bottom: 0;
    }
    /* hide ... if we have text, which is less than or equal to max lines */
    .block-with-text:after {
      /* points in the end */
      content: '';
      /* absolute position */
      position: absolute;
      /* set position to right bottom corner of text */
      right: 0;
      /* set width and height */
      width: 1em;
      height: 1em;
      margin-top: 0.2em;
      /* bg color = bg color under block */
      background: white;
    }
  }
  .details{
    padding-bottom: 50px;
    display: inline-block;
    width: 100%;
    h2{
        font-size:1.3rem;
        margin: 0;
        padding: 0;
        font-family: 'DNLTPro-bold';
        display: inline-block;
    }

     li:first-of-type {
       border-top: 1px solid #ddd;
    }
    li{
      width: 100%;
      float: left;
      clear: both;
      padding: 6px 0px;
      // border-bottom: 1px solid #ddd;
      white-space: nowrap;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: baseline;
      align-items: baseline;
      text-align:center;
      h3 {
          display: block;
          font-size: 1.17em;
          margin: 5px 0 0 0;
          font-weight: bold;
          font-family: 'DNLTPro-bold';
      }
    }
  }
}

.tag-small {
    margin: 0 10px 10px 0;
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    border: 1px solid #666;
    color: #000;
    background-color: transparent;
    font-family: 'DNLTPro-regular';
    font-size: 14px;
    overflow: hidden;
}

}

.journal-list-articles{
    margin: 40px;
    position: relative;
}

.container{
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  display: block;
  box-sizing: border-box;

}

@media (min-width: 1200px){
  .container {
      max-width: 888px;
  }
}


.entry {
    border-bottom: 0;
    border-left: 4px solid #ffffff;
    border-radius: 0;
    border-right: 0;
    border-top: 0;
    display: -webkit-flex;
    display: flex;
    margin-bottom: 32px;
    margin-left: -16px;
    margin-top: 0;
    max-width: 624px;
}


.entry .visual{
    border-radius: 0.2rem;
    margin-right: 20px;
    height: 78px;
    width: 130px;
    background : #a8a8a8;
    //background-image: url('https://lh3.googleusercontent.com/9zWQqBt6i8tdr44hL5O-GK6Ye1wwhHAkJvOx24BF7w4EWIfQHm4RRaODPmvIJ7DH6yhWS6y-Y4Q2pqadWDc9hGYT_Q=s260');
    background-repeat: no-repeat;

}

.visual{
  background-repeat: no-repeat;
  opacity: 1;
  border-radius: 3px;
  display: flex;
  border: 1px solid #DFDFDF;
  background-position: 50% 20%;
  transition-delay: 0.2s;
  -webkit-transition: opacity 0.35s;
  background-size: cover;

}
.el-card .el-card__body{
  width: 100%;
}

.content{

        flex: 2;

      .title{
        display: inline-block;
        font-family: 'DNLTPro-bold';
        font-size: 16px;
        letter-spacing: -.04em;
        line-height: 1.25em;
        margin-bottom: 0.25rem;
        text-decoration: none;
        width: 72%;
      }
      .hide{
        float: right;
        height: 24px;
        padding: 0;
        width: 24px;

        background-size: 20px 20px;
        background-position: center center;
        background-repeat: no-repeat;

        font-weight: normal;
        min-width: 0;

      }
      .hide:hover {
        background-color: inherit;
        opacity: 0.8;
        color: #636363;
      }
      .mark-as-read{
        float: right;
        height: 24px;
        padding: 0;
        width: 24px;

        background-size: 20px 20px;
        background-position: center center;
        background-repeat: no-repeat;

        font-weight: normal;
        min-width: 0;
      }
      .mark-as-read:hover{
        background-color: inherit;
        opacity: 0.8;
        color: #636363;
      }
      .save-for-later{
        float: right;
        height: 24px;
        padding: 0;
        width: 24px;

        background-size: 20px 20px;
        background-position: center center;
        background-repeat: no-repeat;

        font-weight: normal;
        min-width: 0;
      }
      .save-for-later:hover{
        background-color: inherit;
        opacity: 0.8;
        color: #636363;
      }
      .save-to-board{
        float: right;
        height: 24px;
        padding: 0;
        width: 24px;

        background-size: 20px 20px;
        background-position: center center;
        background-repeat: no-repeat;

        font-weight: normal;
        min-width: 0;
      }
      .save-to-board:hover{
        background-color: inherit;
        opacity: 0.8;
        color: #636363;
      }
      .metadata{
        font-family: 'DNLTPro-regular';
        color: #9e9e9e;
        font-size: 13px;
        line-height: 18px;
        overflow: visible;
      }
      .summary{
        font-family: 'DNLTPro-regular';
        font-family: sans-serif;
        font-size: 13px;
        line-height: 18px;
        margin-bottom: 0;
        margin-top: 0.25rem;
        max-height: 54px;
        overflow: hidden;
        word-break: break-word;
        color: #9e9e9e;
      }
}
.footer{
  padding-bottom: 30px;
  display: inline-block;
  text-align: center;
  width: 100%;
}

img {
  position: center;
  width: 24px;
  height: 24px;
}

 button{
   align-items: flex-start;
   text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    -webkit-writing-mode: horizontal-tb !important;

    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    vertical-align: top;
    text-decoration: none;
    box-sizing: border-box;
    letter-spacing: 0;
    box-shadow: none;
    outline: 0;
    background-color: transparent;
 }

</Style>

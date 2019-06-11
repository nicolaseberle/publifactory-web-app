<template>
  <div>
    <el-col :span='7' style='border-right: 1px solid #e8e8e8;'>
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
          Editor:
          <div style='float: right;margin-bottom:3px'>
            <el-button  icon="el-icon-plus" size="mini" circle></el-button>
          </div>
          <li>
            <div v-for='editor in editors'>{{editor.id_user.firstname}} {{editor.id_user.lastname}}</div>
          </li>
        </div>
        <div class='details'>
          Associate Editor:
          <div style='float: right;margin-bottom:3px'>
            <el-button  icon="el-icon-plus" size="mini" circle></el-button>
          </div>
          <li>
            <div v-if='associate_editors.length==0' style='color:#e8e8e8'>None</div>
            <div v-for='associate_editor in associate_editors'>{{associate_editor.id_user.firstname}} {{associate_editor.id_user.lastname}}</div>
          </li>
        </div>
        <div class='details'>
          <li>
            Licence: CC
          </li>
          <li>
            Date: <span>{{ journal.creationDate | moment("DD/MM/YYYY") }}</span>
          </li>
          <li style='color:#a8a8a8'>ISSN : 2049-3630</li>
        </div>

      </div>
    </div>
    </el-col>
    <el-col :span='17'>
      <div class='journal-container'>
      <div class='journal-list-articles'>

        <el-card :body-style="{ padding: '0px' }" v-for='article in journal.content'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.

          {{article}}
          <!--<div slot="header" class="clearfix" style='text-align:left;margin-left:10px'>
            <a :href="'/article/' + artcile._id "><span>{{artcile.title}}</span></a>
          </div>-->
        </el-card>
      </div>
      </div>
    </el-col>

  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      test : 'on est sur la page du journal',
      journalId: '',
      journal: '',
      editors: '',
      associate_editors: ''

    }
  },
  computed: {
    ...mapGetters(['sidebar','userId', 'accessToken'])
  },
  created (){
    this.sidebar.opened = false
    this.journalId = this.$route.params && this.$route.params.id
  },
  mounted () {
    this.fetch()
    this.fetchEditor()
    this.fetchAssociateEditor()
  },
  methods:{
    fetch () {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      axios.get('/api/journals/' + this.journalId, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(res => {
        this.journal = res.data
      }).catch(err => {
        console.error(err)
      })
    },
    fetchEditor () {
      axios.get('/api/roles/journal/' + this.journalId + '/editor', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(res => {
        this.editors = res.data.users
      }).catch(err => {
        console.error(err)
      })
    },
    fetchAssociateEditor () {
      axios.get('/api/roles/journal/' + this.journalId + '/associate_editor', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(res => {
        this.associate_editors = res.data.users
      }).catch(err => {
        console.error(err)
      })
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
    padding-bottom: 70px;

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
}
.container{

}

@media (min-width: 1200px){
  .container {
      max-width: 888px;
  }
}
</Style>

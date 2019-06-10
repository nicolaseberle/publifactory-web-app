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
        <h1 class='title'>Biology - functional cell</h1>
        <div class='description'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in dapibus diam. Maecenas imperdiet convallis iaculis. Nunc dapibus gravida lectus sed cursus. Suspendisse consectetur nulla lectus, ac vulputate leo pulvinar in. In hac habitasse platea dictumst. Duis dolor enim, eleifend ac sapien nec, finibus eleifend sem. Proin felis elit, facilisis sit amet mollis a, rutrum id purus. Nullam suscipit nec neque at vestibulum. Nam feugiat mi quis odio fringilla tempor ut sit amet risus. Nullam feugiat non velit vehicula laoreet. Cras sagittis malesuada justo, ut volutpat ligula.
        </div>
        <el-divider content-position="right"></el-divider>
        <div class='details'>
          Editor: moi
        </div>
      </div>
    </div>
    </el-col>
    <el-col :span='17'>
      <div class='journal-list-articles'>
        {{test}} {{journal}}
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
      journal: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar','userId', 'accessToken'])
  },
  created (){
    this.sidebar.opened = false
    this.journalId = this.$route.params && this.$route.params.id
    this.fetch()
  },
  methods:{
    fetch () {
      // this.$refs.articles.query(articleRes, current, { search: this.search }).then(list => {
      axios.get('/api/journals/' + this.journalId, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(list => {
        this.journal = list.data
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
    font-family: 'DNLTPro-regular';
    width: 100%;
    float: left;
    margin-bottom: 30px;
    font-size: 18px;
    line-height: 22px;
    text-align: justify;
    text-justify: inter-word;
  }
}
}

.journal-list-articles{
    margin: 40px;
}
</Style>

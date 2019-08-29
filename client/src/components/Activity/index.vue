<template>
  <div class="wrapper">
    <header class="wrapper">
        <a href="#" title="Check Activity of the article" class="showactivity active"><svg-icon icon-class='history-clock-button' style='margin:0 10px 0 10px'/>Activity</a>
        <a href="#" title="Close activity bar" class="close-activity" v-on:click='closeActivityTab()'><img src="/static/icons/Close.svg" class="close-activity svg" alt="Close this activty bar"></a>
    </header>
    <section class="content">
        <el-timeline>
          <el-timeline-item v-for='oneEvent in list.data.history' :key='oneEvent.date' :timestamp="oneEvent.date | moment('DD/MM/YYYY')" placement="top">
            <el-card>
              <p><strong>{{oneEvent.id_user.firstname}} {{oneEvent.id_user.lastname}}</strong> {{oneEvent.instruction}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
    </section>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  import asideRightActivity from '../../utils/js/animation/activity.right.js'

  const shortid = require('shortid');
  const debug = require('debug')('frontend');

  export default {
    name: 'viewActivity',
    data () {
      return {
        list: null,
        article_id:''
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'roles',
        'accessToken'
      ])
    },
    created () {
      this.article_id = this.$route.params && this.$route.params.id
    },
    async mounted () {
      try{
        this.list = await axios.get(`/api/history/${this.article_id}/`,
            { headers: { 'Authorization': `Bearer ${this.accessToken}` }
        })
      }
      catch(e) {
          this.list.data = []
      }
    },
    methods: {
      closeActivityTab () {
        this.$emit('close',true)
      }

    }
  }
</script>
<style>
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>

<style scoped>
  .icon-star{
    margin-right:2px;
  }
  .drag-handler{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .show-d{
    margin-top: 15px;
  }
</style>


<template>
  <div class="wrapper">
    <header class="wrapper">
        <a href="#" title="Check Activity of the article" class="showreviews active"><svg-icon icon-class='history-clock-button' style='margin:0 10px 0 10px'/>Activity</a>
        <a href="#" title="Close this side bar" class="close"><img src="/static/icons/Close.svg" class="close svg" alt="Close this side bar"></a>
    </header>
    <section class="content reviews">
      {{list}}
    </section>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  import asideRightAnimation from '../../utils/js/animation/activity.right.js'


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
        asideRightAnimation()
        this.list = await axios.get(`/api/history/${this.article_id}/`,
            { headers: { 'Authorization': `Bearer ${this.accessToken}` }
        })
      }
      catch(e) {
          this.list = []
      }

    },
    methods: {

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

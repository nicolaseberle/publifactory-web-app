<template>
  <div class="app-container">
    <el-row :gutter='10'>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
            <svg-icon icon-class="search"/>
              Total queries
            </div>
          <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>{{nbTotalRequest}}</div>
        </el-card>
      </el-col>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
            <svg-icon icon-class="guide"/>
              Total invitations
            </div>
          <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>0</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style='margin:20px 0px 20px 0px'>
      <el-card>
        <div slot="header" class="clearfix">
          <span>Reviewer Search Engin Activity</span>
        </div>
        <activity-chart id='activity-chart'/>
      </el-card>
    </el-row>
    <!--
    <el-row :gutter='10'>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
            <svg-icon icon-class="user"/>
              Total Users
            </div>
          <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>350</div>
        </el-card>
      </el-col>
        <el-col :span='4'>
      <el-card>
        <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
          <svg-icon icon-class="flask-outline"/>
            Total lab
          </div>
        <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>55</div>
      </el-card>
      </el-col>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
          <svg-icon icon-class="layers"/>
            Total Articles
          </div>
        <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>2500</div>
      </el-card>
      </el-col>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
          <svg-icon icon-class="book"/>
            Total Collections
          </div>
        <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>10</div>
      </el-card>
      </el-col>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
          <svg-icon icon-class="consulting-message"/>
            Total Reviews
          </div>
        <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>547</div>
      </el-card>
      </el-col>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
          <svg-icon icon-class="eye_open"/>
            Total Views
          </div>
        <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>1k</div>
      </el-card>
      </el-col>
    </el-row>
    <el-row style='margin-top:20px'>
      <el-card>
        <div slot="header" class="clearfix">
          <span>Platform activity</span>
        </div>
        <platform-chart id='platform-chart'/>
      </el-card>
    </el-row>-->
    <el-row style='margin-top:20px'>
        <!--<el-col :span='8'>
          <el-card>
            <div slot="header" class="clearfix">
              <span>Recent Activity</span>
            </div>
            <div>
              <activityList/>
            </div>
          </el-card>
        </el-col>-->
        <el-col :span='24'>
          <el-card>
            <div slot="header" class="clearfix">
              <span>Recent Requests</span>
            </div>
            <div>
              <requestList :data='metricsFinal'/>
            </div>
          </el-card>
        </el-col>
    </el-row>
  </div>
</template>
<script>
  import locales from 'locales/article'
  import axios from 'axios'
  import activityChart from '../../components/Charts/echart/activityChart'
  import platformChart from '../../components/Charts/echart/platformChart'
  import activityList from './activityList'
  import requestList from './requestList'
  export default {
  locales,
  data () {
    return {
      metricsFinal: [],
      isMetrics: false,
      nbTotalRequest: 0
    }
  },
  components: {
    "platform-chart":platformChart,
    "activity-chart":activityChart,
    activityList,
    requestList
  },
  methods: {
    getTotalRequest () {
      axios.get('/api/activity/totalRequest')
      .then( async (res) => {
        this.nbTotalRequest = res.data.data;
      }).catch((e)=>{console.log(e)})
    },
    getMetrics(){
      axios.get('/api/activity?page=1&count=10')
      .then( async (res) => {
        this.metricsFinal = res.data.data;
        this.isMetrics = true;
      })
    },
  },
  mounted () {
    this.getTotalRequest()
    this.getMetrics()
  }
}
</script>
<style>
.clearfix:before,
  .clearfix:after {
    background-color: white;
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .el-card .el-card__header{
    text-align: left;
  }
  .clearfix, .el-card .el-card__header{
    background-color: white;
    font-size: 1.2rem;
  }

</style>

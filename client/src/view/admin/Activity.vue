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
          <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>{{nbTotalInvitation}}</div>
        </el-card>
      </el-col>
      <el-col :span='4'>
        <el-card>
          <div style='color:#696969;font-size:1rem;margin:-10px -5px 0 0;'>
            <svg-icon icon-class="user"/>
              Total users
            </div>
          <div style='color:#696969;font-size:3rem;padding-top:1rem;font-weight:800'>{{nbTotalUsers}}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style='margin:20px 0px 20px 0px' :gutter='10'>
      <el-col :span='12'>
        <el-card>
          <div slot="header" class="clearfix">
            <span>Reviewer Search Engin Activity</span>
          </div>
          <activity-chart id='activity-chart'/>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card>
          <div slot="header" class="clearfix">
            <span>Invitation Activity</span>
          </div>
          <invitation-chart id='invitation-chart'/>
        </el-card>
      </el-col>
    </el-row>
    <el-row style='margin-top:20px'>
        <el-col :span='24'>
          <el-card>
            <div slot="header" class="clearfix">
              <span>Recent Requests</span>
            </div>
            <div>
              <requestList/>
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
  import invitationChart from '../../components/Charts/echart/invitationChart'
  import platformChart from '../../components/Charts/echart/platformChart'
  import activityList from './activityList'
  import requestList from './requestList'
  import { mapGetters } from 'vuex'
  export default {
  locales,
  data () {
    return {
      nbTotalRequest: 0,
      nbTotalInvitation: 0,
      nbTotalUsers: 0,
      currentPage: 1
    }
  },
  components: {
    "platform-chart":platformChart,
    "invitation-chart":invitationChart,
    "activity-chart":activityChart,
    activityList,
    requestList
  },
  computed: {
    ...mapGetters([
      'userId',
      'accessToken',
      'loggedIn'
    ])
  },
  methods: {
    getTotalInvitation () {
      axios.get('/api/requests/totalRequest',{
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       })
      .then( async (res) => {
        this.nbTotalInvitation = res.data.data;
      }).catch((e)=>{console.log(e)})
    },
    getTotalRequest () {
      axios.get('/api/activity/totalRequest',{
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       })
      .then( async (res) => {
        this.nbTotalRequest = res.data.data;
      }).catch((e)=>{console.log(e)})
    },
    getUsers () {
      axios.get('/api/users/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       }).then(response => {
        this.nbTotalUsers = response.data.page.total

        })
    },
  },
  mounted () {
    this.getTotalRequest()
    this.getTotalInvitation()
    this.getUsers()
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

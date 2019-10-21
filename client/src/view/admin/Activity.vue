<template>
  <div class="app-container">
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
        <chart/>
      </el-card>
    </el-row>
    <el-row style='margin-top:20px'>
        <el-col :span='8'>
          <el-card>
            <div slot="header" class="clearfix">
              <span>Recent Activity</span>
            </div>
            <div>
              <activityList/>
            </div>
          </el-card>
        </el-col>
    </el-row>
  </div>
</template>
<script>
  import locales from 'locales/article'
  import chart from '../../components/Charts/echart/evolChart'
  import activityList from './activityList'
  export default {
  locales,
  data () {
    return {
    }
  },
  components: {
    chart,
    activityList
  },
  methods: {
  },
  mounted () {

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

  .clearfix, .el-card .el-card__header{
    background-color: white;
    font-size: 1.2rem;
  }

</style>

<template>
  <div class="dashboard-container">
    <el-header>
      <h3>Publiscience</h3>
      <div>
        <div class="collections">
          <i class="el-icon-reading"></i>
          <p>Collections</p>
        </div>
        <p>Login</p>
        <div class="circle_log">
          <i class="el-icon-s-custom"></i>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      temp: true
    }
  },
  methods: {

  }
}
</script>

<style>

.app-wrapper > .el-row {
  display: none!important;
}

.el-header {
  height: 90px;
  border-bottom: 2px solid #C3CFD9;
  display: flex;
  justify-content: space-between;
}

/* font-family: 'DNLTPro-bold';
font-family: 'DNLTPro-regular'; */

</style>

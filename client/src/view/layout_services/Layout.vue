<template>
  <div class="app-wrapper">
    <div class="fixed-nav-bar">
      <el-row style='margin:10px 0px 20px 0px'>
        <el-col :span='20' :offset='2'>
          <navbar/>
          <el-divider></el-divider>
        </el-col>
      </el-row>
    </div>
    <div class='app-container-2'>
      <app-main/>
    </div>
    <el-row style='margin:0px 0px 0px 0px'>
      <footbar/>
    </el-row>
  </div>
</template>

<script>
  import { AppMain, Navbar, Footbar } from './components'
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
  name: 'Layout',
  components: {
    Navbar,
    AppMain,
    Footbar
  },
  mixins: [ResizeMixin],
  computed: {
    device() {
      return this.$store.state.app.device
    }
  }
}
</script>
<style>
.fixed-nav-bar{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  background-color: #FFF;
  height:100px;
}
.app-container-2{
  margin-top:130px;
}
</style>

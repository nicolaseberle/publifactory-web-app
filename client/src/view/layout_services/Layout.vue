<template>
  <div class="app-wrapper">
    <el-row style='margin:10px 0px 20px 0px'>
      <el-col :span='20' :offset='2'>
        <navbar/>
        <el-divider></el-divider>
      </el-col>
    </el-row>
      <app-main/>
    <el-row style='margin:20px 0px 0px 0px'>
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

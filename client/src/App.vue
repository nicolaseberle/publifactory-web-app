<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<!--<script>
export default{
  name: 'App'
}
</script>-->

<!--<template>
  <div id="app-main">
    <nav-menu ></nav-menu>
    <div class="app-wrapper">
      <x-header></x-header>
      <div class="app-container" :class="{active: loggedIn}">
        <router-loading></router-loading>
        <router-view></router-view>
      </div>
      <n-progress parent=".app-wrapper"></n-progress>
    </div>
  </div>
</template>-->
<script>
import Vue from 'vue'
import XHeader from './components/Header'
import NavMenu from './components/NavMenu'
import NProgress from './components/NProgress'
import ContentModule from './components/ContentModule'
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee)

Vue.component('ContentModule', ContentModule)
export default {
  name: 'App',
  computed: {
    ...mapGetters(['loggedIn'])
  },
  components: {
    XHeader,
    NavMenu,
    NProgress,
    'font-awesome-icon': FontAwesomeIcon
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "./styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>

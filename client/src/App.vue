<template>
  <div id="app">
    <div :class="{active: loggedIn}">
      <router-view/>
      <!--<n-progress parent=".app-wrapper"></n-progress>-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import XHeader from './components/Header'
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
    'font-awesome-icon': FontAwesomeIcon,
    'n-progress': NProgress
  }
}
</script>

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
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee)

export default {
  name: 'App',
  computed: {
    ...mapGetters(['loggedIn'])
  },
  components: {
    XHeader,
    'font-awesome-icon': FontAwesomeIcon
  }
}
</script>

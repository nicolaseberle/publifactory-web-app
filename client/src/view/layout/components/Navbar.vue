<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="$t('navbar.nightmode')" effect="dark" placement="bottom">
          <nightmode class="nightmode right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>
<!--
        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>
-->
        <lang-select class="international right-menu-item"/>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--<router-link to="/">-->
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="doSettings">
              {{ $t('navbar.settings') }}
            </el-dropdown-item>
            <!--</router-link>-->
            <el-dropdown-item @click.native="doLogout">
              {{$t('navbar.logout')}}
            </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Breadcrumb from '../../../components/Breadcrumb'
import Hamburger from '../../../components/Hamburger'
import ErrorLog from '../../../components/ErrorLog'
import Screenfull from '../../../components/Screenfull'
import Nightmode from '../../../components/Nightmode'
// import SizeSelect from '../../../components/SizeSelect'
import LangSelect from '../../../components/LangSelect'
import locales from  '../../../locales/navbar'
// import locales2 from '../../../locales/header'

export default {
  locales,
  // locales2,
  components: {
    Nightmode,
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    // SizeSelect,
    LangSelect
  },
  computed: {
    ...mapGetters([
      'username',
      'loggedIn',
      'userId',
      'globalConfig',
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    ...mapActions(['logout', 'updateGlobalConfig']),
    doLogout () {
      this.logout().then(() => {
        this.$router.push('/login')
      })
    },
    doSettings () {
        this.$router.push('/settings')
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    /*logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }*/
  }
}
</script>

<template>
  <div>
  <div class="navbar">
    <div class="m-left-menu">
      <div class='logo'><a href='/'>PubliFactory</a></div>
    </div>
    <div class="m-right-menu">
      <div style='vertical-align:middle'  class='right-menu-item'>
         <el-link :underline="false" style='font-size:16px' href='http://publifactory.co/'><span>Product</span></el-link>
      </div>
      <div class='right-menu-item'>
         <el-link :underline="false"  style='font-size:16px' @click='centerDialogVisible = true'><span>Contact</span></el-link>
      </div>
      <div class='right-menu-item' v-show="loggedIn">
         <el-link :underline="false"  style='font-size:16px' @click='goToDashboard'><span>Dashboard</span></el-link>
      </div>
      <el-dropdown v-show="loggedIn" style='vertical-align:middle' class="right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--<router-link to="/">-->
            <el-dropdown-item @click.native='goToDashboard'>
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
      <!--
      <div class='right-menu-item' v-show="!loggedIn" style="vertical-align: middle;height:40px">

          <el-dropdown>
            <span class="el-dropdown-link">
              <el-progress type="circle" color="#f56c6c"  :percentage="25" :width="40" :stroke-width='6' text-inside></el-progress>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><requestbox :maxInvitation='2'/></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

      </div>-->

      <div class='right-menu-item' v-show="!loggedIn">
        <router-link :to="{name: '/login'}">
          <el-button style='font-weight:800' plain >Sign In</el-button>
        </router-link>
      </div>
      <div class='right-menu-item' v-show="!loggedIn">
        <el-button style='background-color: #000; color:#FFF;font-weight:800'
          disabled>Create Free Account</el-button>
        <!--<el-button style='  border-color: #f56c6c; border-width: 3px; font-weight:800' plain >Free Plan</el-button>-->
      </div>

    </div>
  </div>
  <el-dialog
    title="Contact"
    :visible.sync="centerDialogVisible"
    width="30%"
    center>
    <span>You can contact us: contact@publifactory.co</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="centerDialogVisible = false">Ok</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import ErrorLog from '../../../components/ErrorLog'
  import Screenfull from '../../../components/Screenfull'
  import Nightmode from '../../../components/Nightmode'
  // import SizeSelect from '../../../components/SizeSelect'
  import LangSelect from '../../../components/LangSelect'
  import locales from '../../../locales/navbar'
  // import locales2 from '../../../locales/header'
  // import Requestbox from "./Requestbox"

export default {
  locales,
  // locales2,
  components: {
    Nightmode,
    ErrorLog,
    Screenfull,
    // SizeSelect,
    LangSelect,
    // Requestbox
  },
  data () {
    return {
      flag_user: false,
      centerDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'loggedIn',
      'userId',
      'globalConfig',
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
    goToDashboard () {
      this.$router.push(this.$route.query.redirect || '/dashboard/home')
    },
  }
}
</script>
<style>
.m-navbar{
}
.avatar-wrapper {
  cursor: pointer;
  margin-top: 5px;
  position: relative;}

.avatar-wrapper .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
.avatar-wrapper  .el-icon-caret-bottom {
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }

</style>
<style>
.el-dropdown-menu-pb{
  background-color: '#f56c6c';
}
</style>

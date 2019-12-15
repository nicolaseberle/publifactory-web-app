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
            <el-dropdown-item @click='goToDashboard'>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
            <el-dropdown-item @click="doLogout">
              {{$t('navbar.logout')}}
            </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class='right-menu-item' v-show="!loggedIn">
        <router-link :to="{name: '/login'}">
          <el-button style='  border-color: #333; border-width: 3px; font-weight:800' plain >Login</el-button>
        </router-link>
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
  import Breadcrumb from '../../../components/Breadcrumb'
  import Hamburger from '../../../components/Hamburger'
  import ErrorLog from '../../../components/ErrorLog'
  import Screenfull from '../../../components/Screenfull'
  import Nightmode from '../../../components/Nightmode'
  // import SizeSelect from '../../../components/SizeSelect'
  import LangSelect from '../../../components/LangSelect'
  import locales from '../../../locales/navbar'
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

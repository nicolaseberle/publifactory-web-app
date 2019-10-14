<template>
  <div class="navbar">
    <div class="m-right-menu">
      <div class='right-menu-item'>
        <a><span>Product</span></a>
      </div>
      <div class='right-menu-item'>
        <a><span>Contact</span></a>
      </div>
      <div class='right-menu-item'>
        <el-button style='  border-color: #333; border-width: 3px; font-weight:800' plain>Sign up</el-button>
      </div>
    </div>
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
      flag_user: false
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
      this.$router.push(this.$route.query.redirect || '/')
    }
  }
}
</script>

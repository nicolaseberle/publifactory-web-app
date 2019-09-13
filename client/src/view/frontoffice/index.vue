<template>
  <div class="dashboard-container">

  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import axios from 'axios'
  import locales from '../../locales/register'

  export default {
  locales,
  name: 'FrontOffice',
  data() {
    return {
      id: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'userId',
      'accessToken',
      'sidebar'
    ])
  },
  created() {

  },
  async mounted () {
    await axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => { })
  },
  methods: {
    ...mapActions(['logout','toggleSideBar']),
    doLogout () {
      this.logout().then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>

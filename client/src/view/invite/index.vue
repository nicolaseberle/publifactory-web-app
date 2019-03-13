<template>
  <div class="container">
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { Loading } from 'element-ui';
import locales from 'locales/invitation'
import axios from 'axios'

export default {
  locales,
  name: 'InvitationView',
  data() {
    return {
      postForm: {},
      id: '',
      visible: true,
      fullscreenLoading: false,
      loading: false,
      loginError: false,
      _tempPassword: ''
    }
  },
  async created() {
    let loadingInstance = Loading.service({ fullscreen: true });
    setTimeout(async () => {
      this.id = this.$route.params && this.$route.params.id
      this.postForm  = await this.fetch(this.id)
      this.guestLogin()
      this.$nextTick(() => { // Loading should be closed asynchronously
        loadingInstance.close();
      });
    }, 1500);
  },
  mounted () {


  },
  computed: {
    ...mapGetters(['loggedIn', 'globalConfig'])
  },
  methods: {
    ...mapActions(['login']),
    fetch(id) {
      var data = axios.get('/api/invitations/invite/' + id ).then(response => {
         return response.data
      }).catch(err => {
        console.log(err)
      })
      return data
    },
    guestLogin() {
      if(this.loggedIn){
        this.$router.push(this.$route.query.redirect || '/')
      }else{
      this.login({
        email: this.postForm.recieptEmail,
        password: this.postForm.senderId}).then((data) => {
          this.loading = false
          this.$router.push(this.$route.query.redirect || '/'  )
        }).catch((err) => {
          this.$router.push(this.$route.query.redirect || '/')
        })
      }
    }
  }
}

</script>

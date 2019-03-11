<template>
  <div class="container">
    <!--
    <el-dialog :visible.sync="visible" title="Access & Permission">
      <h1>Welcome </h1>
      <h2>{{postForm.senderFirstname}} {{postForm.senderLastname}} has invited you to join this wonderful article</h2>
      <h2></h2>
      <span slot="footer" class="dialog-footer">
        <h2 style='font-family:"Calibri-regular";'>Please register you before accessing the site</h2>
        <el-button type='primary'>Login</el-button>
        <el-button type='primary'>Register</el-button>
      </span>
    </el-dialog>

  </el-col>-->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { Loading } from 'element-ui';
import locales from 'locales/register'
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
    }, 2000);

    //this.id = this.$route.params && this.$route.params.id
    //load of invitation from params.id of URL obtained in the invitation email
    //this.postForm  = await this.fetch(this.id)

    //this.guestLogin()
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

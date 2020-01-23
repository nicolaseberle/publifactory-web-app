<template>
  <div class="login-main">
    <div class="bg"></div>
  <div class="login-wrapper" v-show="!loggedIn">

    <!--<h1>{{$t('title')}}</h1>-->
    <img style='margin: 0 0 40px 0;' src='/static/img/logo-publifactory.png'></img>
    <h1 style='font-size:1.8rem; font-family:"Calibri"'>Reset Your Password</h1>
    <p>We’ll email you instructions to reset your password. </p>
    <el-form class="login-form" ref="form" :model="form" :rules="rules"
      @submit.native.prevent="onSubmit">
      <el-form-item>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="form.email" :placeholder="$t('login.email')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-button" :class="{error: loginError}" type="success"
          native-type="submit" :loading="loading">Reset Password</el-button>
          <a  href='/login' style='text-decoration:underline'>Return to Login</a>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import locales from 'locales/login'

  export default {
  locales,
  data () {
    return {
      form: {
        email: ''
      },
      rules: {
        email: [{
          required: true, message: this.$t('login.email'), trigger: 'blur'
        }]
      },
      loading: false,
      loginError: false
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'globalConfig'])
  },
  methods: {
    ...mapActions(['resetPassword', 'changeLang']),
    onSubmit () {
      this.$refs.form.validate(valid => {

        if (valid) {
          this.loading = true
          this.resetPassword({email: this.form.email})
          .then((data) => {
            const h = this.$createElement;
            this.$message({
              title: this.$t('message.save.ok'),
              message: this.$t('login.reset.message'),
              type: 'success'
            })
            this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {
            const h = this.$createElement;
            this.$message({
              title: this.$t('message.save.err'),
              message: this.$t('login.reset.nomail'),
              type: 'error'
            })
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
<style>
.login-wrapper{
  position: fixed;
  top:0;
  left:0;
  height: 100%;
  margin: 0 0 0 0;
}
.login-form button{
  background-color: rgb(48, 65, 86);
  border: none

}
.login-form button:hover{
  background-color: rgba(48, 65, 86,0.8);
  border: none
}

</style>

<template>
  <div class="login-main">
    <div class="bg"></div>
  <div class="login-wrapper" v-show="!loggedIn">

    <!--<h1>{{$t('title')}}</h1>-->
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
import { mapGetters, mapActions } from 'vuex'
import locales from 'locales/login'

export default {
  locales,
  data () {
    return {
      form: {
        email: '',
        password: ''
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
    ...mapActions(['login', 'changeLang']),
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {

        }
      })
    }
  }
}
</script>

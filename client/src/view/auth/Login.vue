<template>
  <div class="login-main">
    <div class="bg"></div>
  <div class="login-wrapper" v-show="!loggedIn">

    <h1>{{$t('title')}}</h1>
    <el-form class="login-form" ref="form" :model="form" :rules="rules"
      @submit.native.prevent="onSubmit">
      <el-form-item>
        <el-select :value="globalConfig.lang" @input="changeLang(arguments[0])">
          <el-option v-for="lang in globalConfig.langs" :key="lang.value"
            :label="lang.label" :value="lang.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="form.email" :placeholder="$t('login.email')"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" :placeholder="$t('login.password')"></el-input>
      </el-form-item>
      <div class='register'>
        <a href='/register' style="text-align:end">Create an account</a>
      </div>
      <el-form-item>
        <el-button class="login-button" :class="{error: loginError}" type="success"
          native-type="submit" :loading="loading">{{$t('login.button')}}</el-button>
      </el-form-item>
      <h2>or</h2>

      <el-form-item>
          <el-button class="login-button"    type="primary" native-type="submit" :loading="loading">{{$t('login.googleButton')}}</el-button>
      </el-form-item>
      <el-form-item>
          <el-button class="login-button"    type="primary" native-type="submit" :loading="loading">{{$t('login.orcidButton')}}</el-button>
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
        }],
        password: [{
          required: true, message: this.$t('login.password'), trigger: 'blur'
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
          this.loading = true
          this.login({
            email: this.form.email,
            password: this.form.password
          }).then((data) => {
            this.loading = false
            this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {
            this.$notify({
              title: this.$t('message.error'),
              message: err.message || this.$t('login.authFail'),
              type: 'error',
              duration: 1500
            })
            this.loading = false
            this.loginError = true
            setTimeout(() => {
              this.loginError = false
            }, 500)
          })
        }
      })
    }
  }
}
</script>

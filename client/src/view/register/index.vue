<template>
  <div class="login-main">
    <div class="bg"></div>
  <div class="login-wrapper" v-show="!loggedIn">

    <h1>{{$t('registerTitle')}}</h1>
    <el-form class="login-form" ref="form" :model="form" :rules="rules"
      @submit.native.prevent="onSubmit">
      <el-form-item>
        <el-select :value="globalConfig.lang" @input="changeLang(arguments[0])">
          <el-option v-for="lang in globalConfig.langs" :key="lang.value"
            :label="lang.label" :value="lang.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="form.email" :placeholder="$t('register.email')"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" :placeholder="$t('register.password')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-button" :class="{error: loginError}" type="success"
          native-type="submit" :loading="loading">{{$t('register.button')}}</el-button>
      </el-form-item>
      <h2>or</h2>
      <el-form-item>
          <el-button class="login-button"    type="primary" native-type="submit" :loading="loading">{{$t('register.googleButton')}}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="login-button"    type="primary" native-type="submit" :loading="loading">{{$t('register.orcidButton')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import locales from 'locales/register'
import axios from 'axios'

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
          required: true, message: this.$t('register.email'), trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('register.password'), trigger: 'blur'
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
            axios.post('/api/users/',{ "email": this.form.email,"password":this.form.password})
            .then(response => {
              this.$message({
                title: this.$t('message.created'),
                message: this.$t('message.created'),
                type: 'success'
              })
              this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {
            this.$message({
              title: this.$t('message.error'),
              message: err.message || this.$t('register.authFail'),
              type: 'error'
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

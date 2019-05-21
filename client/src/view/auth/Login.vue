<template>
  <div class="login-main">
  <div class="bg"></div>
  <div class="login-wrapper" v-show="!loggedIn">

    <!--<h1>{{$t('title')}}</h1>-->
    <img style='margin: 0 0 40px 0;' src='/static/img/logo-publifactory.png'></img>
    <h1 style='font-size:1.8rem; font-family:"Calibri"'>Login</h1>
    <!--<p style='font-size:0.9rem;'>or <a href='/register' style="text-decoration:underline;text-align:end">Create an account</a></p>-->
    <el-form class="login-form" ref="form" :model="form" :rules="rules">
      <el-form-item>
        <!--<el-select :value="globalConfig.lang" @input="changeLang(arguments[0])">
          <el-option v-for="lang in globalConfig.langs" :key="lang.value"
            :label="lang.label" :value="lang.value"></el-option>
        </el-select>-->
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="form.email" :placeholder="$t('login.email')"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" :placeholder="$t('login.password')"></el-input>
      </el-form-item>
      <div class='register' style='margin:5px 0 10px 0; '>
        <!--<a href='/register' style="text-align:end">Create an account</a>-->
        <p style='font-size:0.9rem;'>or <a href='/register' style="text-decoration:underline;text-align:end">Create an account</a></p>
      </div>

      <el-form-item>
        <el-button class="login-button" :class="{error: loginError}" type="primary"
          v-on:click="onSubmit()" :loading="loading">{{$t('login.button')}}</el-button>
      </el-form-item>
      <h2>or</h2>
<!--
      <el-form-item>
          <el-button class="login-button"    type="primary" native-type="submit" :loading="loading">{{$t('login.googleButton')}}</el-button>
      </el-form-item>
    -->
      <el-form-item>
          <el-button class="login-button"    type="primary" native-type="submit" :loading="loading" v-on:click="onOrcidSubmit()">{{$t('login.orcidButton')}}</el-button>
      </el-form-item>

    </el-form>
    <div class='register' style='float:right'>
      <a href='/login/forgot' style="font-size=0.6rem;text-decoration:underline;text-align:end">Forgot password?</a>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import locales from 'locales/login'
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
    ...mapActions(['login', 'loginOrcid', 'changeLang']),
    onOrcidSubmit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await new Promise((resolve, reject) => {
            /*
            axios.get('https://orcid.org/oauth/authorize?client_id=APP-HCKHJYQTALPVGUJ1&response_type=code&scope=/authenticate&redirect_uri=http://localhost:9001/orcid', {
              headers: {
                'Access-Control-Allow-Origin': '*',
              },
            })
              .then(response => this.alert("WORKED"))
              .catch(error => this.alert("DONT WORK"))
              .finally(() => this.alert('AXIOS DONE'));
              */

            $.ajax({
              url: 'https://orcid.org/oauth/authorize?client_id=APP-HCKHJYQTALPVGUJ1&response_type=code&scope=/authenticate&redirect_uri=http://localhost:9001/orcid',
              type: 'GET',
              headers: {
                "Access-Control-Allow-Origin": "*"
              },
              xhrFields: {
                withCredentials: true,
                crossDomain: true
              },
              success: function (result, status, xhr) {
                alert("Logged In: " + result.loggedIn);
              },
              error: function (xhr, status, error) {
                alert(status);
              }
            });
            resolve('OK')
          })
          /*this.loading = true
          this.loginOrcid({
            email: this.form.email,https://sandbox.orcid.org/userStatus.json?logUserOut=true
            password: this.form.password
          }).then((data) => {
            this.loading = false
            this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {
            const h = this.$createElement;
            this.$message({
              title: this.$t('message.error'),
              message: err.message || this.$t('login.authFail'),
              type: 'error'
            })
            this.loading = false
            this.loginError = true
            setTimeout(() => {
              this.loginError = false
            }, 500)
          }) */

        }
      })
    },
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
            const h = this.$createElement;
            this.$message({
              title: this.$t('message.error'),
              message: err.message || this.$t('login.authFail'),
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

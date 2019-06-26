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
      <!--<h2>or</h2>-->
<!--
      <el-form-item>
          <el-button class="login-button"    type="primary" native-type="submit" :loading="loading">{{$t('login.googleButton')}}</el-button>
      </el-form-item>
    -->
    <h2>or</h2>
    <el-row>
      <el-form-item>
        <el-row>
          <el-row>
          <el-button class="login-button" style=' background: #A6CE3A' :class="{error: loginError}" type="primary" :loading="loading" v-on:click="onOrcidSubmit()">
            <svg-icon icon-class='ORCID_iD'  style='transform: scale(1.5);background-size: 40px 40px;color: white;font-size:1em;margin-right:3em'/>
            <!--<i class="ai ai-orcid ai-2x" style='color: white;font-size:1em;margin-right:3em'/>-->
            {{$t('login.orcidButton')}}
          </el-button>
        </el-row>
        <el-row>
          <el-button class="login-button" style='margin-top:5px; background: #4885ed' :class="{error: loginError}" type="primary" :loading="loading">
            <i class="fab fa-google" style='transform: scale(1.2) ; color: white;font-size:1em;margin-right:3em'></i>
            {{$t('login.googleButton')}}
          </el-button>
        </el-row>

<!--
      <div class='logo'>
        <i class="ai ai-orcid ai-3x el-logo" style='color:#A6CE3A'/>

        <el-button  style='background: #4885ed' circle>
        <i class="fab fa-google" style='color: white;font-size:1em'></i>
      </el-button>
      </div>-->
          <!--<el-button  size='medium' class="login-icon" circle>
            <svg-icon icon-class='search_google'/>
          </el-button>->
        </div>
        </div>
          <el-button class="login-button" circle   type="primary" native-type="submit" :loading="loading" style='background-color:#A6CE3A ; vertical-align: middle;' v-on:click="onOrcidSubmit()" ></el-button>-->
        </el-row>
      </el-form-item>
    </el-row>

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

const debug = require('debug')('frontend')

export default {
  locales,
  props: {
    userId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      id: '',
      redirect: '',
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
  created () {
    if (this.$route.query.userId)
      this.onCreation()
    if (this.$route.query.redirect) {
      this.redirect = this.$route.query.redirect
      this.onOrcidLogin()
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'globalConfig'])
  },
  methods: {
    ...mapActions(['login', 'loginOrcid', 'changeLang', 'checkEmail']),
    onOrcidSubmit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await new Promise((resolve, reject) => {
            axios.post('/api/users/orcid',{ "email": this.form.email,"password":this.form.password, provider: 'local'})
              .then(response => {
                this.$message({
                  title: this.$t('message.created'),
                  message: this.$t('message.created'),
                  type: 'success'
                })
                resolve("OK")
              }).catch((err) => {
              this.$message({
                title: this.$t('message.error'),
                message: err.message || this.$t('register.authFail'),
                type: 'error'
              })
              this.loading = false
              this.loginError = true
              reject(err)
              setTimeout(() => {
                this.loginError = false
              }, 500)
            })
          })
          await this.login({
            email: this.form.email,
            password: this.form.password
          }).then((data) => {
            this.loading = false
            window.location.href = 'https://orcid.org/oauth/authorize?client_id=APP-HCKHJYQTALPVGUJ1&response_type=token&scope=openid&redirect_uri=http://localhost:9001/'
          }).catch((err) => {
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
    },
    onCreation () {
      this.checkEmail({
        userId: this.userId
      }).then(() => {
        this.$message({
          title: this.$t('message.updated'),
          message: this.$t('emailVerification.success')
        })
      })
        .catch(() => {
          this.$message({
            title: this.$t('message.error'),
            message: this.$t('emailVerification.failure')
          })
        })
    },
    onSubmit () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const sth = await this.login({
            email: this.form.email,
            password: this.form.password
          }).then((data) => {
            this.loading = false
            this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {
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
          debug("THE VALUE OF THE PROMISE : " + sth);
        }
      })
    },
    onOrcidLogin() {
      const regExp = /access_token=(.*?)&token_type=(.*?)&expires_in=(.*?)&.*id_token=(.*?)&tokenId=(.*)/g
      if (regExp.exec(this.redirect).length === 6) {

      }
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
.login-btn-icon-orcid {
    background-image: url(/static/logo_orcid.svg);
}
div.logo {
    border: 1px solid none;
    line-height: 50px;
    padding: 10px 0px;
    text-align: center;
    vertical-align: middle;
}

i.el-logo{
    margin-left: 10px;
    font-size: 40px;
    height: 40px;
    vertical-align: middle;
}


.login-or {
position: relative;
margin-top: 10px;
margin-bottom: 10px;
padding-top: 10px;
padding-bottom: 10px;
}
.span-or {
display: block;
position: absolute;
left: 50%;
top: -2px;
margin-left: -25px;
background-color: None;
width: 50px;
text-align: center;
}
.hr-or {
  color: black;
  background: black;
  height: 1px;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}

</style>

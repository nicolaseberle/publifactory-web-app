<template>
  <div class='login-modal-content' >
    <div v-if='active=="login"'>
      <div class='headline dmaasNavy--text text--lighten-1 text--bold mb-2'>{{$t('login.signIn')}}
      </div>
      <!--<h1 style='font-size:1.8rem; font-family: "DNLTPro-bold";'>Sign in</h1>-->
      <p class='caption'><span>or </span><a v-on:click="switchRegister" style='color:#00a97f!important;'>create an account</a></p>
      <el-form class="login-form" ref="form" :model="form" :rules="rules">
        <el-form-item prop="email">
          <el-input v-model="form.email" :placeholder="$t('login.email')"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" :placeholder="$t('login.password')"></el-input>
        </el-form-item>

        <div class='register' style='float:right'>
          <a href='/login/forgot' style="font-size=0.6rem;text-decoration:underline;text-align:end">Forgot password?</a>
        </div>
        <el-button class="login-button" :class="{error: loginError}" type="primary"
          v-on:click="onSubmitLogin()" :loading="loading" round>{{$t('login.signIn')}}</el-button>
      </el-form>
    </div>
    <div v-else>
      <div class='headline dmaasNavy--text text--lighten-1 text--bold mb-2'>{{$t('login.createFreeAccount')}}
      </div>
      <!--<h1 style='font-size:1.8rem; font-family: "DNLTPro-bold";'>Sign in</h1>-->
      <p class='caption'><span>or </span><a v-on:click="switchLogin" style='color:#00a97f!important;'>sign in</a></p>
      <el-form  class="login-form" ref="formRegister" :model="formRegister" :rules="rulesRegister">
        <el-form-item prop="email">
          <el-input v-model="form.email" :placeholder="$t('login.email')"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" :placeholder="$t('login.password')"></el-input>
        </el-form-item>
        <el-form-item prop="type">
        <el-checkbox v-model="form.type" label="I agree to the Term of Use" name="type"></el-checkbox>
        </el-form-item>
        <el-button class="login-button" :class="{error: loginError}" type="primary"
          v-on:click="onSubmitRegister()" :loading="loading" round>{{$t('login.register')}}</el-button>
      </el-form>

    </div>



  </div>
</template>
<script>
import locales from 'locales/login'
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default{
  locales,
  data (){
    return {
      form: {email: "",password:""},
      formRegister: {email:"",password:"",type:false},
      active: 'login',
      loading: false,
      rules: {
        email: [{
          required: true, message: this.$t('login.email'), trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('login.password'), trigger: 'blur'
        }]
      },
      rulesRegister:{
        email: [{
          required: true, message: this.$t('login.email'),
        }],
        password: [{
          required: true, message: this.$t('login.password'),
        }],
        type: [
					{
						type: "array",
						required: true,
						message: "You need to accept the Term of Use (CGU)",
						trigger: "blur"
					}
				]
      },
      loginError: false
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'globalConfig'])
  },
  methods: {
    ...mapActions(['login', 'changeLang']),
    switchRegister (){
      this.active = 'register'
    },
    switchLogin (){
      this.active = 'login'
    },
    onSubmitLogin () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const sth = await this.login({
            email: this.form.email,
            password: this.form.password
          }).then((data) => {
            this.loading = false
            this.$emit('close')
          }).catch((err) => {
            let message = null;
            if (err.body.message === 'ACCOUNTS_INVALID_PASSWORD')
              message = this.$t("login.passwordFail")
            this.$message({
              title: this.$t('message.error'),
              message: message || this.$t('login.authFail'),
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
    onSubmitRegister () {
      this.$refs.formRegister.validate(valid => {
        if (valid) {
            this.loading = true
            axios.post('/api/users/',{ "email": this.formRegister.email,"password":this.formRegister.password, provider: 'local'})
            .then(response => {
              this.loading = false
              this.$message({
                title: this.$t('message.created'),
                message: this.$t('message.created'),
                type: 'success'
              })
              this.switchLogin()
          }).catch((err) => {
            this.loading = false
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
<style lang='scss'>
.login-modal .el-dialog .el-dialog__header {
    background-color: #FFF;
    //border-top: 5px solid #00a97f!important;
    border-top: 5px solid #2F4155!important;
}

.login-modal .login-form button{
  //background-color: #00a97f!important;
  background-color: #2F4155!important;
  border: none
}
.login-modal .login-modal-content .login-form button:hover{
  background-color: rgba(48, 65, 86,0.8);
  color: #FFF;
  border: none
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
.v-lazy-image {
  filter: blur(10px);
  transition: filter 0.7s;
}
.v-lazy-image-loaded {
  filter: blur(0);
}
.legend{
  position:absolute;
  bottom:0;
  right:0;
  background-color: AliceBlue ;
  font-size:0.7rem;
}
.caption {
    font-size: 12px!important;
    font-weight: 400;
}
p {
    margin-bottom: 16px;
}

.dmaasNavy--text.text--lighten-1 {
    color: #51636e!important;
}
.text--bold {
    font-weight: 700!important;
}
.mb-2 {
    margin-bottom: 8px!important;
}
.headline {
    font-size: 24px!important;
    font-weight: 400;
    line-height: 32px!important;
    letter-spacing: normal!important;
}
.dmaasNavy--text {
    color: #2F4155!important;
    //color: #324854!important;
}
.login-button{
  width:100%;
}

.login-modal-content{
  margin: 20 20 20 20;
  width:100%;
  text-align: center;
}

.register{
  margin-bottom: 20px;
}
</style>

<template>
  <div class="login-main">

  <v-lazy-image class='bg'
    :src='bg.image'
    :src-placeholder='bg.small_image'
  />
  <div class="login-wrapper" v-show="!loggedIn">
    <img style='margin: 0 0 40px 0;' src='/static/img/logo-publifactory.png'></img>
    <h1 style='font-size:1.8rem; font-family:"Calibri"'>{{$t('registerTitle')}} in Publifactory</h1>

    <!--<h1 style='font-size:1.8rem; font-family:"Calibri"'>{{$t('registerTitle')}} in Publifactory</h1>-->
    <el-form class="login-form" ref="form" :model="form" :rules="rules">
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
        <el-input v-model="form.password" type="password" :placeholder="$t('register.password')" ></el-input>
      </el-form-item>
      <el-form-item>
      <el-checkbox v-model="checkedCGU">I accept the
        <a style='text-decoration:underline'>
          <router-link class="logo-wrapper" to="/legal" exact>Term of Use</router-link>
        </a>
      </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="login-button" :class="{error: loginError}" type="success"
          v-on:click="onSubmit()" :loading="loading">{{$t('register.button')}}</el-button>
      </el-form-item>
      <!--
      <h2>or</h2>
      <el-form-item>
        <el-row>
          <el-button class="login-button" style=' background: #A6CE3A' :class="{error: loginError}" type="primary" :loading="loading" v-on:click="onSubmitOrcid()">
            <svg-icon icon-class='ORCID_iD'  style='transform: scale(1.5);background-size: 40px 40px;color: white;font-size:1em;margin-right:3em'/>
            {{$t('register.orcidButton')}}
          </el-button>
        </el-row>
        <el-row>
          <el-button class="login-button" style='margin-top:5px; background: #4885ed' :class="{error: loginError}" type="primary" :loading="loading" v-on:click="onSubmitGoogle()">
            <i class="fab fa-google" style='transform: scale(1.2) ; color: white;font-size:1em;margin-right:3em'></i>
            {{$t('register.googleButton')}}
          </el-button>
        </el-row>
      </el-form-item>
      -->
    </el-form>
  </div>
</div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import locales from 'locales/register'
  import axios from 'axios'

  export default {
  locales,
  data () {
    return {
      bg:  this.randomImage() ,
      checkedCGU: false,
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
    ...mapGetters(['loggedIn', 'globalConfig', 'accessToken'])
  },
  methods: {
    ...mapActions(['login', 'loginOrcid', 'changeLang']),
    onSubmitGoogle () {

    },
    onSubmitOrcid () {
      this.$refs.form.validate(valid => {
        if (valid) {
          axios.post('/api/users/', { "email": this.form.email, "password": this.form.password, provider: 'orcid' })
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
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
            this.loading = true
            axios.post('/api/users/',{ "email": this.form.email,"password":this.form.password, provider: 'local'})
            .then(response => {
              this.loading = false
              this.$message({
                title: this.$t('message.created'),
                message: this.$t('message.created'),
                type: 'success'
              })
              this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {
            this.loading = false
            this.$message({
              title: this.$t('message.error'),
              message: err.message || this.$t('register.authFail'),
              type: 'error'
            })
            this.loginError = true
            setTimeout(() => {
              this.loginError = false
            }, 500)
          })
        }
      })
    },
    randomImage() {
      let number = Math.ceil(Math.random()*9)
      return {
        'image':"/static/images/login-bg-"+ number + ".jpg",
        'small_image':"/static/images/login-bg-"+ number + "-small.jpg",
        'legend': ''
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

</style>

<template>
  <div class="app-container"  v-show="loggedIn">
    <el-form  ref="form" :model="form" :rules="rules"
      @submit.native.prevent="onSubmit">
      <h2>Settings</h2>
      <el-form-item prop="firstname">
        <el-row>
          <el-col :span="4">
            {{$t('settings.firstname')}}
          </el-col>
          <el-col :span="8">
            <el-input v-model="form.firstname" :placeholder="$t('settings.firstname')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="lastname">
        <el-row>
          <el-col :span="4">
            {{$t('settings.lastname')}}
          </el-col>
          <el-col :span="8">
            <el-input v-model="form.lastname" :placeholder="$t('settings.lastname')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="email">
        <el-row>
          <el-col :span="4">
            {{$t('settings.email')}}
          </el-col>
          <el-col :span="8">
            <el-input v-model="form.email" :placeholder="$t('settings.email')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
      <el-row>
        <el-col :span="4">
          {{$t('settings.numORCID')}}
        </el-col>
        <el-col :span="8">
          13344-2239203-2023023
        </el-col>
      </el-row>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="4">
            {{$t('settings.language')}}
          </el-col>
          <el-col :span="8">
          <el-select :value="globalConfig.lang" @input="changeLang(arguments[0])">
            <el-option v-for="lang in globalConfig.langs" :key="lang.value"
              :label="lang.label" :value="lang.value"></el-option>
          </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="password">
        <el-row>
          <el-col :span="4">
            {{$t('settings.oldPassword')}}
          </el-col>
          <el-col :span="8">
            <el-input v-model="form.oldPassword" type="password" :placeholder="$t('settings.password')"></el-input>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item>
      <el-row>
        <el-col :span="4">
          {{$t('settings.newPassword')}}
        </el-col>
        <el-col :span="8">
          <el-input v-model="form.newPassword" type="password" :placeholder="$t('settings.password')"></el-input>
        </el-col>
      </el-row>
      </el-form-item>
      <el-row>
        <el-col :span="8" :offset="4">
          <div style="text-align:right">
            <el-button type="primary" round v-on:click="save()">Save</el-button>
          </div>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import locales from 'locales/settings'
import axios from 'axios'
export default {
  locales,
  data () {
    return {
      form: {
        email: '',
        password: '',
        firstname: '',
        lastname:  ''
      },
      rules: {
        email: [{
          required: true, message: this.$t('settings.email'), trigger: 'blur'
        }],
        firstname: [{
          required: false, message: this.$t('settings.firstname'), trigger: 'blur'
        }],
        lastname: [{
          required: false, message: this.$t('settings.firstname'), trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('settings.password'), trigger: 'blur'
        }]
      },
      loading: false,
      loginError: false
    }
  },
  computed: {
    ...mapGetters(['loggedIn', 'globalConfig', 'accessToken'])
  },
  mounted () {
    axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => {
        console.log(response.data.email)
      this.form.email = response.data.email
      this.form.firstname = response.data.firstname
      this.form.lastname = response.data.lastname})
  },
  methods: {
    ...mapActions(['changeLang']),
    save () {
      axios.get('/api/users/me',{headers: {
        'Authorization': `Bearer ${this.accessToken}`}
      }).then(data => {
          console.log(data)})
      /*
      this.getUserInfo(this.accessToken).then(user => {
          console.log(user.email)
        })
        */
      /* this.$refs.form.validate(valid => {
        if (valid) {
            axios.put('/api/users/',{ "email": this.form.email,"password":this.form.password})
            .then(response => {
              console.log("welcome new user")
              this.$router.push(this.$route.query.redirect || '/')
          }).catch((err) => {})
        }
      }) */
    }
  }
}
</script>

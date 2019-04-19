<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>

    <el-dialog :visible.sync="visibleDiagFirstConnexion" title="Access & Permission" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <h1>Welcome </h1>
      <h2>Michael Rera has invited you to access this article</h2>
      <p>Change your password</p>
      <br>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="Email">
          <el-input v-model="form.email" :value="form.email"  :placeholder="form.email" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" placeholder="new password" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type='primary' @click="doLogout">Quit</el-button>
        <el-button type='primary' @click="changePassword">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import adminDashboard from './admin'
import editorDashboard from './editor'
import userDashboard from './user'

export default {
  name: 'Dashboard',
  components: { adminDashboard, userDashboard, editorDashboard },
  data() {
    return {
      id: '',
      visibleDiagFirstConnexion: false,
      currentRole: 'userDashboard',
      form: {
        email: '',
        password: '',
        firstname: '',
        lastname: ''
      },
      rules: {
        email: [{
          required: true, message: this.$t('register.email'), trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('register.password'), trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'userId',
      'accessToken'
    ])
  },
  created() {
    if (this.roles.includes('editor')) {
      this.currentRole = 'editorDashboard'
      this.visibleDiagFirstConnexion = false
    }
    if (this.roles.includes('user')) {
      this.currentRole = 'userDashboard'
      this.visibleDiagFirstConnexion = false
    }
    if (this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'
      this.visibleDiagFirstConnexion = false
    }
    // a guest account has only one role : [guest]
    if (this.roles.includes('guest') && this.roles.length==1) {
      this.currentRole = 'userDashboard'
      this.visibleDiagFirstConnexion = true
    }
  },
  mounted () {
    axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => {
      this.form.email = response.data.email
      this.form.firstname = response.data.firstname
      this.form.lastname = response.data.lastname
      })
  },
  methods: {
    ...mapActions(['resetGuestPassword','logout']),
    doLogout () {
      this.logout().then(() => {
        this.$router.push('/login')
      })
    },
    changePassword () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.resetGuestPassword({id: this.userId,
            password: this.form.password,
            token: this.accessToken
          }).then((data) => {
            this.visibleDiagFirstConnexion = false
          }).catch(err => {
            console.log(err)
          });
        }
      })
    }
  }
}
</script>

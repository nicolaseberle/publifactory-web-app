<template>
  <div class="app-container" v-show="loggedIn">
    <div class="components-container-dashboard">
      <content-module name="users">
        <data-table ref="users" @page-change="fetch">
          <div slot="toolbar">
            <el-button type="primary" icon="plus" @click.native="createUser" round>{{$t('operation.create')}}</el-button>
          </div>
          <el-table :data="users">
            <el-table-column property="firstname" label="Firstname" sortable min-width="120"></el-table-column>
            <el-table-column property="lastname" label="Lastname" sortable min-width="120"></el-table-column>
            <el-table-column property="role" :label="$t('user.model.role')" min-width="90"></el-table-column>
            <el-table-column :label="$t('operation.operation')" align="center" width="120">
              <template scope="scope">
                <el-button type="text" @click.native="deleteUser(scope.row)">{{$t('operation.remove')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </data-table>
        <!--<el-dialog :title="$t('user.create.title')" v-model="formVisible" @close="cancelForm">
          <el-form :model="form" :rules="rules" ref="form"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form-item :label="$t('user.model.username')" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user.model.password')" prop="password">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click.native="formVisible=false">{{$t('confirm.cancel')}}</el-button>
            <el-button type="primary" @click.native="saveForm">{{$t('confirm.ok')}}</el-button>
          </span>
        </el-dialog>-->
      </content-module>
    </div>
  </div>
</template>
<script>
import DataTable from '../../components/DataTable'
import locales from '../../locales/users'
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  locales,
  data () {
    return {
      listQuery: {
        page: {current : 1},
        limit: 10
      },
      search: {
      },
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
          required: true, message: this.$t('user.rules.username'), trigger: 'blur'
        }],
        password: [{
          required: true, message: this.$t('user.rules.password'), trigger: 'blur'
        }]
      },
      formVisible: false,
      users: []
    }
  },
  components: {
    DataTable
  },
  computed: {
    ...mapGetters([
      'roles',
      'userId',
      'accessToken',
      'loggedIn'
    ])
  },
  methods: {
    fetch () {
      axios.get('/api/users/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       }).then(response => {
        console.log(response.data.results)
        this.users = response.data.results
        })
    },
    createUser () {
      this.formVisible = true
    },
    cancelForm () {
      this.form.username = ''
      this.form.password = ''
      this.formVisible = false
    },
    saveForm () {

    },
    deleteUser (user) {

    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetch()
    })
  }
}
</script>

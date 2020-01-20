<template>
  <div class="app-container" v-show="loggedIn">
    <div class="components-container-dashboard">
      <content-module name="users">
        <data-table ref="users" :page="listQuery.page">
          <div slot="toolbar">
            <el-button type="primary" icon="plus" @click.native="createUser" round>{{$t('operation.create')}}</el-button>
          </div>
          <el-table :data="users" @row-click="setSelectedRow" fit highlight-current-row style="width: 100%">
            <el-table-column property="firstname" label="Firstname" sortable min-width="120"></el-table-column>
            <el-table-column property="lastname" label="Lastname" sortable min-width="120"></el-table-column>
            <el-table-column property="email" label="Email" sortable min-width="120"></el-table-column>
            <el-table-column property="role" :label="$t('user.model.role')" min-width="90"></el-table-column>
            <el-table-column property="isVerified" :label="$t('user.model.validated')" min-width="90">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.isVerified===true" type="success">Yes</el-tag>
                <el-tag v-else type="info">No</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation.operation')" align="center" width="120">
              <template slot-scope="scope">
                <!--<router-link :to="'/example/edit/'+scope.row.id">-->
                  <!--<el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>-->
                  <el-dropdown trigger="click" class="international" @command="actionHandleCommand">
                    <div>
                      <el-button class="el-button-action" icon="el-icon-more" circle>
                      </el-button>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item  command="modifyUserSettings">Modify Settings</el-dropdown-item>
                      <el-dropdown-item  command="blockUser">Block User</el-dropdown-item>
                      <el-dropdown-item  command="sendMessage">Send a message</el-dropdown-item>
                      <el-dropdown-item  command="resetPassword">Reset Password</el-dropdown-item>
                      <el-dropdown-item  command="remove"><div style="color:'red'">Remove user</div></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  </el-button>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </data-table>
      </content-module>
    </div>
    <!-- Form User Creation-->
    <el-dialog title="Create an new user" :visible.sync="formVisible">
      <el-form :model="form">
        <el-form-item label="Firstname" :label-width="formLabelWidth">
          <el-input v-model="form.firstname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Lastname" :label-width="formLabelWidth">
          <el-input v-model="form.lastname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">Cancel</el-button>
        <el-button type="primary" @click="formVisible = false">Create</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import DataTable from '../../components/DataTable'
  import locales from '../../locales/users'
  import axios from 'axios'
  import { mapGetters } from 'vuex'

  export default {
  locales,
  data () {
    return {
      selectedRow : '',
      selectedUserId: '',
      listQuery: {
        page: {current : 1},
        limit: 10
      },
      search: {
      },
      form: {
        firstname: '',
        secondname: '',
        email: ''
      },
      rules: {
        email: [{
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
    fetchUsers () {
      axios.get('/api/users/', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       }).then(response => {
        console.log(response.data.results)
        this.users = response.data.results
        })
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
        this.selectedUserId = row._id
    },
    actionHandleCommand (action) {
      if(action=='nothing'){
        console.log("nothing")
      }else if(action=='remove'){
        this.deleteUser(this.selectedUserId)
      }
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
    deleteUser (userId) {
      this.$confirm(`This action will remove the selected user forever, still going on?`, this.$t('confirm.title'), {
        type: 'warning'
      }).then(() => {
        axios.delete('/api/users/' + userId, {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
         }).then(response => {
           this.$message({
             type: 'success',
             message: this.$t('message.removed')
           })
         })
        this.fetchUsers()
      }).catch(() => {})
    },
    resetPassword () {

    },
    sendMessage () {

    },
    modifyUserSettings () {

    },
    blockUser () {

    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fetchUsers()
    })
  }
}
</script>
<style>
.el-table__header{
  text-align:left;
}
.el-table .cell{
  text-align: center;
}
</style>

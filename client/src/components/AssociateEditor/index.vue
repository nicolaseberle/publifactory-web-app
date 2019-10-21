
<template>
  <div>
    <div style='margin: 0px 0px 20px 0px'>
      <el-alert
        title="A email will be sent to invite the associate editor to join this journal"
        type="info">
      </el-alert>
    </div>
    <el-form :model="dynamicValidateForm" :rules="rules" ref="dynamicValidateForm" label-width="120px" >
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item label="Firstname" prop="firstname">
            <el-input v-model="dynamicValidateForm.firstname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Lastname" prop="lastname">
            <el-input v-model="dynamicValidateForm.lastname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="email"
            label="Email"
            :rules="[
            { required: true, message: 'Please input email address', trigger: 'blur' },
            { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
          ]"
          >
            <el-input v-model="dynamicValidateForm.email">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span='4'>
          <el-button type="primary" @click="submitForm('dynamicValidateForm')" >Add</el-button>
        </el-col>
      </el-row>

    </el-form>
    <div style='margin-top:60px;margin-bottom:40px'>

      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" align="left">

        <el-table-column align="left" min-width="140px" label="Firstname">
          <template slot-scope="scope">
            <span>{{ scope.row.id_user.firstname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" min-width="140px" label="Lastname">
          <template slot-scope="scope">
            <span>{{ scope.row.id_user.lastname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Action" width="80">
          <template slot-scope="scope">
            <a @click='removeAE(scope.row.id_user._id)'><i class="el-icon-delete"></i></a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style='text-align:right'>
      <span slot="footer" class="dialog-footer">
        <el-button type=""  @click="$emit('close')" round>Cancel</el-button>
        <el-button type="primary"  @click="$emit('close')" round>OK</el-button>
      </span>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import { mapGetters } from 'vuex'

  const shortid = require('shortid');
  const debug = require('debug')('frontend');

  export default {
    name: 'viewAddAssociateEditor',
    components: {},
    data () {
      return {
        journal_id : '',
        dynamicValidateForm: {
          email: '',
          firstname: '',
          lastname: ''
        },
        rules: {
          email: [
            { type: 'email',required: true, message: 'Please input correct email address', trigger: ['blur', 'change'] }
          ],
          firstname: [
            { required: true, message: 'Please input firstname', trigger: 'blur' }
          ],
          lastname: [
            { required: true, message: 'Please input lastname', trigger: 'blur' }
          ]
        },
        listLoading: false,
        list: null
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'roles',
        'accessToken'
      ])
    },
    created () {
      this.journal_id = this.$route.params && this.$route.params.id
    },
    async mounted () {
      this.fetchAssociateEditor()
      /*
      this.list = await new Promise((resolve, reject) => {
        axios.get(`/api/journals/${this.journal_id}/`, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
          .then(data => {
            resolve(data.data.users)
          })
          .catch(err => reject(err))
      })
      console.log('this.list :: ',this.list)*/
    },
    methods: {
      fetchAssociateEditor () {
        axios.get('/api/roles/journal/all/' + this.journal_id + '/associate_editor', {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then(res => {
          console.log('fetchAssociateEditor :: ', res.data.users)
          this.list = res.data.users
        }).catch(err => {
          console.error(err)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addAE()
          } else {
            debug('error submit!!');
            return false;
          }
        });
      },
      async addAE () {
        let newAE = {
          email: this.dynamicValidateForm.email,
          firstname: this.dynamicValidateForm.firstname,
          lastname: this.dynamicValidateForm.lastname
        }
        // warning. it's temporarly.
        newAE = await this.invite(newAE.email,
          newAE.firstname,
          newAE.lastname);

        await this.fetchAssociateEditor()
        this.$forceUpdate()
        this.cleanForm()
      },
      async invite (email, firstname, lastname) {
        let sender = this.userId;
        let shortId = shortid.generate();
        while (shortId.indexOf('-') >= 0) {
          shortId = shortid.generate();
        }
        let link = shortId;
        let inviteTo = email;
        let message = "toto";
        let name = this.userId;

        const res = await axios.post('/api/invitations/invite/associate_editor?id_journal=' + this.journal_id, {
          "sender": sender,
          "link": link,
          "to": inviteTo,
          "msg": message,
          "name": name
        }, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
        if (res.data == null)
          (await this.createTempAccount(email, link, firstname, lastname))
        return await this.addNewAE(email)
      },
      async addNewAE (email) {
        const _newAE = {
          'email': email
        }
        return await axios.put('/api/journals/'+ this.journal_id +'/addAssociateEditor',{ 'associate_editor' : _newAE}, {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        })
      },
      createTempAccount (_email,_password, _firstname,_lastname) {
        return axios.post('/api/users/guest',{ "email": _email,"password": _password,"firstname": _firstname,"lastname": _lastname})
          .then(res => {
            return res.data
          }).catch((err) => {
            setTimeout(() => {
              this.loginError = false
            }, 500)
          })
      },
      cleanForm () {
        this.dynamicValidateForm.email = ''
        this.dynamicValidateForm.firstname = ''
        this.dynamicValidateForm.lastname = ''
      },
      removeAE(_removeAssociateEditorId) {
        this.$confirm(`This action will remove this author, still going on?`, this.$t('confirm.title'), {
          type: 'warning'
        }).then(() => {
          this.list = this.list.filter(function( el ) {
            return el._id !== _removeAssociateEditorId;
          });

          axios.put('/api/journals/' + this.journal_id + '/removeAssociateEditor',{ 'associate_editor_id' : _removeAssociateEditorId}, {
            headers: {'Authorization': `Bearer ${this.accessToken}`}
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: this.$t('message.removed')
              })
              // this.fetchMyArticles()
            })
        }).catch(() => {})
      }
    }
  }
</script>
<style scoped>
  .icon-star{
    margin-right:2px;
  }
  .drag-handler{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .show-d{
    margin-top: 15px;
  }
</style>

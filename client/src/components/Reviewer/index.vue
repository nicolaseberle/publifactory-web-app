
<template>
  <div>
    <div style='margin: 0px 0px 20px 0px'>
      <el-alert
        title="A email will be sent to invite reviewers to review the article"
        type="info">
      </el-alert>
      ID de l'article : {{article_id}}
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
<!--
    <div style='margin-top:60px;margin-bottom:40px'>

      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" align="left" :default-sort = "{prop: 'rank', order: 'ascending'}">

        <el-table-column prop='rank' align="left" label="Rank" width="65" >
        </el-table-column>

        <el-table-column align="left" min-width="140px" label="Firstname">
          <template slot-scope="scope">
            <span>{{ scope.row.author.firstname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" min-width="140px" label="Lastname">
          <template slot-scope="scope">
            <span>{{ scope.row.author.lastname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Role" width="140">
          <template slot-scope="scope">
            <el-select v-model="scope.row.role" >
              <el-option
                v-for="item in optionsEditRole"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Drag" width="80">
          <template slot-scope="scope">
            <svg-icon class="drag-handler" icon-class="drag"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Action" width="80">
          <template slot-scope="scope">
            <a @click='removeAuthor(scope.row._id)'><i class="el-icon-delete"></i></a>
          </template>
        </el-table-column>
      </el-table>
    </div>-->
    <div style='text-align:right'>
      <span slot="footer" class="dialog-footer">
        <el-button type=""  @click="$emit('close')" round>Cancel</el-button>
        <el-button type="primary"  @click="onChange" round>OK</el-button>
      </span>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Sortable from 'sortablejs'
  import { mapGetters } from 'vuex'

  const shortid = require('shortid');

  export default {
    name: 'viewReviewer',
    components: {},
    props: {
      article_id: {}
    },
    data() {
      return {
        list: null,
        total: null,
        sortable: null,
        listLoading: false,
        oldList: [],
        newList: [],
        dynamicValidateForm: {
          email: '',
          firstname: '',
          lastname: ''
        },
        optionsEditRole: [{
          value: 'Lead',
          label: 'Lead'
        },
          {
            value: 'Author',
            label: 'Author'
          },
          {
            value: 'SeniorAuthor',
            label: 'Senior Author'
          }],
        defaultEditRole: 'Co-Author',
        optionsPermissions: [{
          value: 'edit',
          label: 'Edit'
        }, {
          value: 'view',
          label: 'View'
        }, {
          value: 'admin',
          label: 'Admin'
        }],
        defaultPermission: 'edit',
        idArticle : '',
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
        }
      }
    },
    computed: {
      ...mapGetters([
        'userId',
        'roles',
        'accessToken'
      ])
    },
    created() {
      this.idArticle = this.$route.params && this.$route.params.id
      //this.total = 2
    },
    mounted() {
      //this.list = this.authors
      //this.oldList = this.list.map(v => Number(v.rank))
      //this.newList = this.oldList.slice()
      //this.$nextTick(() => {
      //  this.setSort()
      //})
    },
    methods: {
      setSort() {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
            this.newList.splice(evt.newIndex, 0, tempIndex)

            this.newList.forEach((id_rank,key)=>{
              this.list[key].rank = Number(id_rank)
            })
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addAuthor()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      async addAuthor () {
        const nbAuthors = this.list.length + 1
        const newAuthor = {
          rank: nbAuthors,
          role: 'Author',
          author: {
            email: this.dynamicValidateForm.email,
            firstname: this.dynamicValidateForm.firstname,
            lastname: this.dynamicValidateForm.lastname
          }
        }
        // warning. it's temporarly.
        newAuthor.author = await this.invite(newAuthor.author.email,
          newAuthor.author.firstname,
          newAuthor.author.lastname);
        this.list.push(newAuthor)
        this.newList = this.list.map(v => Number(v.rank))
        this.$forceUpdate()
        this.cleanForm()
      },
      invite (email, firstname, lastname) {
        let sender = this.userId;
        let shortId = shortid.generate();
        while (shortId.indexOf('-') >= 0) {
          shortId = shortid.generate();
        }
        let link = shortId;
        let inviteTo = email;
        let message = "toto";
        let name = this.userId;

        return new Promise((resolve, reject) => {
          axios.post('/api/invitations/invite/collaborator?id_article=' + this.idArticle, {
            "sender": sender,
            "link": link,
            "to": inviteTo,
            "msg": message,
            "name": name
          }, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
            .then(async (res) => {
              //if the email is not in the db -> create guest account
              if (res.data == null) {
                console.log("creation of the temp account")
                resolve((await this.createTempAccount(email, link, firstname, lastname)).user)
              } else {
                console.log("this account exists yet")
                resolve(res)
              }
            }).then(() => {
            this.addNewAuthor(email)
          })
        })
      },
      addNewAuthor (email) {
        var _newAuthor = {
          'rank': this.list.length,
          'role': 'Author',
          'email': email
        }
        axios.put('/api/articles/'+ this.idArticle +'/addAuthors',{ 'author' : _newAuthor}, {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        })
          .then(res => {
            return res
          }).catch((err) => {
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
      removeAuthor(_removedAuthorId) {
        this.$confirm(`This action will remove this author, still going on?`, this.$t('confirm.title'), {
          type: 'warning'
        }).then(() => {
          this.list = this.list.filter(function( el ) {
            return el._id !== _removedAuthorId;
          });
          this.newList = this.list.map(v => Number(v.rank))

          axios.put('/api/articles/' + this.idArticle + '/removeAuthor',{ 'authorId' : _removedAuthorId}, {
            headers: {'Authorization': `Bearer ${this.accessToken}`}
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: this.$t('message.removed')
              })
              this.fetchMyArticles()
            })
        }).catch(() => {})
      },
      onChange() {
        const newAuthors = this.list
        /*axios.patch(`/api/articles/${this.idArticle}/authorRights`, { newAuthors: newAuthors },
          { headers: {'Authorization': `Bearer ${this.accessToken}`} })
          .then(() => {
            this.$message({
              type: "success",
              message: this.$t('message.changeRole')
            })
          }).catch(() => {
          this.$message({
            type: "error",
            message: this.$t('message.changeRoleFail')
          })
        })*/
        this.$emit('close')
      }
    }
  }
</script>
<style>
  .sortable-ghost{
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>

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

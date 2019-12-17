
<template>
  <div>
    <div style="margin: 0px 0px 20px 0px">
      <el-alert
        title="A email will be sent to invite the associate editor to review the article"
        type="info"
      ></el-alert>
    </div>
    <el-form
      :model="dynamicValidateForm"
      :rules="rules"
      ref="dynamicValidateForm"
      label-width="120px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="Select" prop="AE">
            <el-select v-model="selectedAE" placeholder="Select">
              <el-option
                v-for="item in listOfAE"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
            <el-input v-model="dynamicValidateForm.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <el-form-item label="Message" prop="message">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 20}"
              placeholder="Please input"
              v-model="message"
            ></el-input>
          </el-form-item>
        </el-col>
        <!--
      <el-col :span='4'>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')">Send</el-button>
      </el-col>
        -->
      </el-row>
    </el-form>

    <!--
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
    -->
    <div style="text-align:right">
      <span slot="footer" class="dialog-footer">
        <el-button type @click="$emit('close')" round>Cancel</el-button>
        <el-button type="primary" @click="$emit('close')" round>Send</el-button>
      </span>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

const shortid = require('shortid');
const debug = require('debug')('frontend');

export default {
  name: 'viewAddAE',
  components: {},
  props: {
    idarticle: ''
  },
  data() {
    return {
      selectedAE: '',
      listOfAE: [{ value: '', label: '' }],
      message: '',
      dynamicValidateForm: {
        email: '',
        firstname: '',
        lastname: ''
      },
      rules: {
        email: [
          {
            type: 'email',
            required: true,
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
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
    };
  },
  computed: {
    ...mapGetters(['userId', 'roles', 'accessToken'])
  },
  watch: {
    idarticle(newVal) {
      if (newVal !== undefined) {
        console.log(this.idarticle);
        this.initComponent();
      }
    }
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    initComponent() {
      this.list = new Promise((resolve, reject) => {
        axios
          .get(`/api/articles/${this.idarticle}/`, {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          })
          .then(data => {
            console.log('AE : ', data.data.journal);
            resolve(data.data.journal);
          })
          .catch(err => reject(err));
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addAE();
          //change status of the article
          axios.post(
            '/api/history/' + this.idarticle,
            { instruction: 'UPDATE_STATUS' },
            { headers: { Authorization: `Bearer ${this.accessToken}` } }
          );
        } else {
          debug('error submit!!');
          return false;
        }
      });
    },
    async addAE() {
      let newReviewer = {
        email: this.dynamicValidateForm.email,
        firstname: this.dynamicValidateForm.firstname,
        lastname: this.dynamicValidateForm.lastname
      };
      // warning. it's temporarly.
      newReviewer = await this.invite(
        newReviewer.email,
        newReviewer.firstname,
        newReviewer.lastname
      );
      this.list.push(newReviewer);
      this.$forceUpdate();
      this.cleanForm();
    },
    invite(email, firstname, lastname) {
      let sender = this.userId;
      let shortId = shortid.generate();
      while (shortId.indexOf('-') >= 0) {
        shortId = shortid.generate();
      }
      let link = shortId;
      let inviteTo = email;
      let message = 'toto';
      let name = this.userId;

      return new Promise((resolve, reject) => {
        axios
          .post(
            '/api/invitations/invite/reviewer?id_article=' + this.idarticle,
            {
              sender: sender,
              link: link,
              to: inviteTo,
              msg: message,
              name: name
            },
            { headers: { Authorization: `Bearer ${this.accessToken}` } }
          )
          .then(async res => {
            //if the email is not in the db -> create guest account
            if (res.data == null)
              resolve(
                (await this.createTempAccount(email, link, firstname, lastname))
                  .user
              );
            else resolve(res);
          })
          .then(() => this.addNewAE(email));
      });
    },
    addNewAE(email) {
      const _newAE = {
        email: email
      };
      axios
        .put(
          '/api/articles/' + this.idarticle + '/addAssociateEditor',
          { associate_editors: _newAE },
          {
            headers: { Authorization: `Bearer ${this.accessToken}` }
          }
        )
        .then(res => {
          return res;
        });
    },
    createTempAccount(_email, _password, _firstname, _lastname) {
      return axios
        .post('/api/users/guest', {
          email: _email,
          password: _password,
          firstname: _firstname,
          lastname: _lastname
        })
        .then(res => {
          return res.data;
        })
        .catch(err => {
          setTimeout(() => {
            this.loginError = false;
          }, 500);
        });
    },
    cleanForm() {
      this.dynamicValidateForm.email = '';
      this.dynamicValidateForm.firstname = '';
      this.dynamicValidateForm.lastname = '';
    },
    removeAE(_removeAeId) {
      this.$confirm(
        `This action will remove this author, still going on?`,
        this.$t('confirm.title'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.list = this.list.filter(function(el) {
            return el._id !== _removeAeId;
          });

          axios
            .put(
              '/api/articles/' + this.idarticle + '/removeReviewer',
              { reviewerId: _removeAeId },
              {
                headers: { Authorization: `Bearer ${this.accessToken}` }
              }
            )
            .then(() => {
              this.$message({
                type: 'success',
                message: this.$t('message.removed')
              });
              this.fetchMyArticles();
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>

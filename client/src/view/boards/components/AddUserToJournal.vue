<template>
  <div>
    <el-form
      :model="formInvitationPublisher"
      :rules="formInvitationPublisherRules"
      ref="formInvitationPublisher"
      label-width="180px"
      class="dialog-create-journal"
      style="text-align:left"
    >
    <el-form-item label="Journal" prop="journal">
      <el-select
        v-model="formInvitationPublisher.journal"
        filterable
        remote
        placeholder="Enter your revue"
        :remote-method="remoteMethod"
        @change="loadJournalInformation"
        :loading="loading">
        <el-option
          v-for="item in listJournals"
          :key="item.label"
          :label="item.title"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Your role" prop="role">
      <el-select v-model="formInvitationPublisher.role" placeholder="Your Role">
        <el-option
          v-for="item in roleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="Editor in Chief - Name" prop="nameEditorInChief">
      <el-input v-model="formInvitationPublisher.nameEditorInChief" placeholder="John Smith"></el-input>
    </el-form-item>
    <el-form-item label="Editor in Chief - Email" prop="emailEditorInChief" >
      <el-input v-model="formInvitationPublisher.emailEditorInChief" placeholder="john.smith@nature.com"></el-input>
    </el-form-item>
    <el-form-item style="text-align:right">
      <el-button type="primary" @click="submitForm()">Add</el-button>
      <el-button @click="$emit('close')">Cancel</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

const debug = require('debug')('frontend');

export default {
  name: 'CreateJournal',
  data() {
    return {
      loading: true,
      journal: ["Nature"],
      roleOptions: [{value:"Editor in Chief",label:"Editor in Chief"},
                    {value:"Associate Editor",label:"Associate Editor"}],
      listJournals: [],
      formInvitationPublisher: {
        journal: {title:'',issn:'',tags:[]},
        emailEditorInChief: '',
        nameEditorInChief: '',
        issn: '',
        role: ''
      },
      formInvitationPublisherRules: {
        journal: [
          {
            required: true,
            message: "You need to enter your journal",
            trigger: "blur"
          }
        ],
        role: [
          {
            required: true,
            message: "You need to enter your role",
            trigger: "blur"
          }
        ],
        nameEditorInChief: [
          {
            required: true,
            message: "You need to enter the name of the editor in chief",
            trigger: "blur"
          }
        ],
        emailEditorInChief: [
          {
            required: true,
            type: "email",
            message: "You need to enter the email of the editor in chief",
            trigger: "blur"
          }
        ],
      }
    };
  },
  computed: {
    ...mapGetters(['userId', 'accessToken'])
  },
  created() {
    axios
      .get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      })
      .then(response => {
        this.dynamicForm.editor.firstname = response.data.firstname;
        this.dynamicForm.editor.lastname = response.data.lastname;
        this.dynamicForm.editor.name =
          this.dynamicForm.editor.firstname +
          ' ' +
          this.dynamicForm.editor.lastname;
      })
      .catch(() => {});
  },
  mounted() {},
  methods: {
    remoteMethod(query) {
			if (query !== '') {
				this.loading = true;
				setTimeout(() => {
          axios.get('/api/journal-names/?count=20&title='+query)
            .then( (response)=>{
            this.list = response.data;
            this.loading = false;
  					this.listJournals = this.list.filter(item => {
  						item.label = item.title

              item.title = item.title
              item.issn = item.issn1 + "  " + item.issn2 + "  " + item.issn3
              item.tags = [item.forOneName]
              item.value = item.title
              return item;
  					});}
            )
				}, 200);
			} else {
				this.listJournals = [];
			}
		},
    submitForm(dynamicForm) {
      this.$refs[dynamicForm].validate(valid => {
        if (valid) {
          this.$confirm(
            `By clicking on Create, I acknowledge having read the Conditions Générales d'utilisation de Publifactory, as well as the General Conditions of Use of the Publifactory site and I accept them.`,
            this.$t('confirm.title'),
            {
              type: 'warning'
            }
          )
            .then(() => {
              this.createJournal();
              this.$emit('close');
            })
            .catch(() => {});
        } else {
          debug('error submit!!');
          return false;
        }
      });
    },
    handleClose(tag) {
      this.dynamicForm.tags.splice(this.dynamicForm.tags.indexOf(tag), 1);
    },
    createJournal() {
      const newJournal = {
        title: this.dynamicForm.title,
        abstract: this.dynamicForm.abstract,
        tags: this.dynamicForm.tags
      };
      axios
        .post('/api/journals/', newJournal, {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        })
        .then(response => {
          let new_journal_id = response.data.journal._id;
          debug(response.data);
          debug('create successfully ');
          this.$router.push({ path: `/journals/${new_journal_id}` });
        })
        .catch(e => {
          console.log(e);
        });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicForm.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-select{
  width:100%;
}
</style>

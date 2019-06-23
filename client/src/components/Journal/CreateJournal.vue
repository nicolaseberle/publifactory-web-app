<template>
  <div>
    <el-form  :model="dynamicForm" :rules="rules" ref="dynamicForm" label-width="120px" class="dialog-create-journal" style='text-align:left'>
      <el-form-item label="Title" :label-width="formLabelWidth" prop="title">
        <el-col :span='12'>
          <el-input  v-model="dynamicForm.title" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Description" :label-width="formLabelWidth" prop="abstract">
        <el-col :span='12'>
          <el-input  v-model="dynamicForm.abstract" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Editors" :label-width="formLabelWidth">
        <el-col :span='12'>
          <el-input  v-model="dynamicForm.editor.name" autocomplete="off" disabled>{{dynamicForm.editor.firstname}} {{dynamicForm.editor.lastname}}</el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Keywords" :label-width="formLabelWidth" prop="keywords">
        <el-tag
          :key="tag"
          v-for="tag in dynamicForm.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="mini"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput()">+ New keypoint</el-button>

      </el-form-item>
      <el-form-item label="Access Policy" :label-width="formLabelWidth">
      <el-radio v-model="dynamicForm.access" label="open_access">Open Access</el-radio>
      <el-radio v-model="dynamicForm.access" label="close_access">Close Access</el-radio>
      </el-form-item>
      <el-form-item style='text-align:right'>
        <el-button type="primary" @click="submitForm('dynamicForm')">Create</el-button>
        <el-button @click="$emit('close')">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import axios from 'axios'
import { mapGetters } from 'vuex'
const debug = require('debug')('frontend');

  export default {
    name: 'CreateJournal',
    data () {
      return {
        inputTagsVisible : false,
        newTag : '',
        dynamicForm: {
          title: '',
          logo: '',
          abstract: '',
          editor: {firstname:'',lastname:'',name:''},
          published: false,
          tags: ['biology','genetics'],
          access:  'open_access'
        },
        formLabelWidth: '120px',
        inputVisible: false,
        inputValue: '',
        rules: {
         title: [
           { required: true, message: 'Please input Journal name', trigger: 'blur' },
           { min: 3, message: 'Length should be more than 3 letters', trigger: 'blur' }
         ],
         abstract: [
           { required: true, message: 'Please input a description of the journal', trigger: 'blur' },
           { min: 3, message: 'Length should be more than 3 letters', trigger: 'blur' }
         ]
       }
      }
    },
    computed: {
      ...mapGetters(['userId', 'accessToken'])
    },
    created () {
      axios.get('/api/users/me',{headers: {
        'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        this.dynamicForm.editor.firstname = response.data.firstname
        this.dynamicForm.editor.lastname = response.data.lastname
        this.dynamicForm.editor.name = this.dynamicForm.editor.firstname + ' ' + this.dynamicForm.editor.lastname
      }).catch(()=>{})
    },
    mounted () {

    },
    methods: {
      submitForm(dynamicForm) {
        this.$refs[dynamicForm].validate((valid) => {
          if (valid) {
            this.$confirm(`By clicking on Create, I acknowledge having read the Conditions Générales d'utilisation de Publifactory, as well as the General Conditions of Use of the Publifactory site and I accept them.`, this.$t('confirm.title'), {
                type: 'warning'
              }).then(()=>{
                this.createJournal()
                this.$emit('close')
            }).catch(() => {})

          } else {
            debug('error submit!!')
            return false;
          }
        });
      },
      handleClose(tag) {
        this.dynamicForm.tags.splice(this.dynamicForm.tags.indexOf(tag), 1);
      },
      createJournal (){
        const newJournal = {
          title: this.dynamicForm.title,
          abstract: this.dynamicForm.abstract,
          tags: this.dynamicForm.tags,
          published: true
        };
        axios.post('/api/journals/', newJournal, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
        .then(response => {
          let new_journal_id = response.data.journal._id
          debug(response.data)
          debug("create successfully ")
          this.$router.push({ path: `/journals/${new_journal_id}` })
        })
        .catch(e => {
          console.log(e)
        })
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
  }
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

</style>

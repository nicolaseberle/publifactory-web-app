<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" class="dialog-create-journal" style='text-align:left'>
      <el-form-item label="Title" :label-width="formLabelWidth">
        <el-col :span='12'>
          <el-input  v-model="dynamicForm.title" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Description" :label-width="formLabelWidth">
        <el-col :span='12'>
          <el-input  v-model="dynamicForm.asbtract" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Keywords" :label-width="formLabelWidth">
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
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New keypoint</el-button>

      </el-form-item>
      <el-form-item label="Access Policy" :label-width="formLabelWidth">
      <el-radio v-model="settings.access" label="open_access">Open Access</el-radio>
      <el-radio v-model="settings.access" label="close_access">Close Access</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="$emit('close')">Create</el-button>
    </span>
  </div>
</template>

<script>
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
          published: false,
          tags: ['biology','genetics']
        },
        formLabelWidth: '120px',
        settings: {access: 'open_access' },
        inputVisible: false,
        inputValue: ''
      }
    },
    created () {

    },
    mounted () {

    },
    methods: {
      handleClose(tag) {
        this.dynamicForm.tags.splice(this.dynamicForm.tags.indexOf(tag), 1);
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

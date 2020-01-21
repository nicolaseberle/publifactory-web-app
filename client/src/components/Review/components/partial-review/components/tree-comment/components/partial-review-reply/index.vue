<template>
  <el-card style="margin-top:10px">
    <el-row
      v-show="anonymous"
      type="flex"
      class="row-bg"
      style="margin: 0px 0 5px 0;align-items: center;"
    >
      <div style="font-family:Calibri-bold;color:#f3f3f3;">Anonymous peer review</div>
    </el-row>
    <el-row class="row-bg" style="margin: 5px 0 20px 0;align-items: center;">
      <el-checkbox v-model="anonymous">
        <svg-icon icon-class="private" />
      </el-checkbox>
      <div style="float:right">
        <el-button type class="button-submit" v-on:click="cancel()" icon="el-icon-close">Cancel</el-button>
        <el-button
          type="primary"
          class="button-submit"
          v-on:click="reply()"
          icon="el-icon-upload2"
        >Reply</el-button>
      </div>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <!-- <el-input type="textarea" :rows="2" placeholder="Please input" v-model="editAnswer"></el-input> -->
      <div class="partial-review-reply-input">
        <div v-bind:id="idEditor"></div>
        <div v-bind:id="idToolBar" style="z-index=1000;">
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-blockquote"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-list" value="bullet"></button>
            <button class="ql-indent" value="-1"></button>
            <button class="ql-indent" value="+1"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-link"></button>
          </span>
        </div>
      </div>
    </el-row>
  </el-card>
</template>

<script>
import 'quill/dist/quill.snow.css';
import uuidv4 from 'uuid/v4';

const Quill = require('quill');

export default {
  name: 'partialReviewReply',
  data() {
    return {
      anonymous: false,
      editor: {},
      idEditor: this.setIdEditor(),
      idToolBar: this.setIdToolBar()
    };
  },
  mounted() {
    const quill = new Quill('#' + this.idEditor, {
      modules: {
        toolbar: '#' + this.idToolBar
      },
      theme: 'snow'
    });
    this.editor = quill;
  },
  methods: {
    setIdEditor() {
      return `editor-container-${String(uuidv4())}`;
    },
    setIdToolBar() {
      return `toolbar-container-${String(uuidv4())}`;
    },
    cancel() {
      this.$emit('cancel');
    },
    reply() {
      this.$emit('reply', {
        content: this.editor.root.innerHTML,
        anonymous: this.anonymous
      });
    }
  }
};
</script>

<style scoped>
.partial-review-reply-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: none;
  border: 1px solid #ccc;
}
.ql-toolbar.ql-snow {
  border-left: none;
  border-right: none;
  border-bottom: none;
}
</style>
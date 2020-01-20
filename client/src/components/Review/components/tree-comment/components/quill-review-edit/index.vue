<template>
  <div>
    <div class="quill-review-edit-container-input">
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
      <div></div>
    </div>
    <div class="quill-review-edit-container-action">
      <el-button icon="el-icon-close" type="primary" v-on:click="cancelComment()" circle></el-button>
      <el-button icon="el-icon-check" type="success" v-on:click="saveComment()" circle></el-button>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.snow.css';
import uuidv4 from 'uuid/v4';

const Quill = require('quill');
export default {
  name: 'quillReviewEdit',
  props: {
    content: String
  },
  data() {
    return {
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
    this.editor.root.innerHTML = this.content;
  },
  methods: {
    setIdEditor() {
      return `editor-container-${String(uuidv4())}`;
    },
    setIdToolBar() {
      return `toolbar-container-${String(uuidv4())}`;
    },
    cancelComment() {
      this.$emit('cancelComment');
    },
    saveComment() {
      this.$emit('saveComment', this.editor.root.innerHTML);
    }
  }
};
</script>

<style scoped>
.quill-review-edit-container-input {
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
.quill-review-edit-container-action {
  margin: 10px 0px 0px 0px;
  display: flex;
  justify-content: flex-end;
  align-content: flex-end;
}
</style>
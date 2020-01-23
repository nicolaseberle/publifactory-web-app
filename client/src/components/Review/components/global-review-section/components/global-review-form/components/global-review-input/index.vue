<template>
  <div class="global-review-reply-input">
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
</template>

<script>
import 'quill/dist/quill.snow.css';
import uuidv4 from 'uuid/v4';

const Quill = require('quill');
export default {
  name: 'globalReviewInput',
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
  },
  methods: {
    setIdEditor() {
      return `editor-container-${String(uuidv4())}`;
    },
    setIdToolBar() {
      return `toolbar-container-${String(uuidv4())}`;
    }
  }
};
</script>

<style scoped>
.global-review-reply-input {
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

  <!-- <generic-dialog v-if="showDl" :show-dialog.sync="showDl">
      <template v-slot:header>
        <div>
          <p>head</p>
        </div>
      </template>
      <template v-slot:body>
        <div>
          <p>body</p>
        </div>
      </template>
      <template v-slot:footer>
        <div>
          <p>footer</p>
        </div>
      </template>
  </generic-dialog>-->

<template>
  <el-dialog
    :visible.sync="show"
    v-on:update:visible="updateShowDialog"
    :title="title"
    width="50%"
    append-to-body
  >
    <slot name="header">Dialog:</slot>
    <slot name="body">Body</slot>
    <slot name="footer">
      <span class="dialog-footer">
        <el-button @click="$emit('update:showDialog', false);">Cancel</el-button>
        <el-button type="primary" @click="$emit('onSubmit', article, preprint)">Submit</el-button>
      </span>
    </slot>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
export default {
  name: 'generic-dialog',
  props: {
    showDialog: Boolean,
    title: String
  },
  data() {
    return {
      show: this.showDialog
    };
  },
  computed: {},
  watch: {},
  async mounted() {},
  methods: {
    updateShowDialog(isVisible) {
      this.$emit('update:showDialog', false);
    }
  }
};
</script>
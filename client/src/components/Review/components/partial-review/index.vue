<template>
  <div>
    <tree-comment :nodes="nodes" v-on:post="reload" :depth="0" :socket="this.socket"></tree-comment>
    <partial-review-edit v-on:newReport="newReport" :articleId="articleId"></partial-review-edit>
  </div>
</template>

<script>
import { Socket } from 'net';
import treeComment from './components/tree-comment';
import partialReviewEdit from './components/partial-review-edit';
export default {
  name: 'partialReview',
  props: {
    nodes: Array,
    depth: Number,
    socket: {},
    articleId: String
  },
  components: {
    treeComment,
    partialReviewEdit
  },
  methods: {
    reload() {
      this.$emit('post');
    },
    newReport(data) {
      console.log("NewReport=>", data);
      this.$emit('newReport', data)
    }
  }
};
</script>
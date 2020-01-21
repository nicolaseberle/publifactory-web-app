<template>
  <div>
    <tree-comment v-for="(review, key) in reviews"
      :key="key"
      :child="review.child"
      :reviewId="review._id"
      :label="review.content"
      :scores="review.scores"
      :creationDate="review.createdAt"
      :reviewType="review.type"
      :anonymous="review.anonymous"
      :user="review.userId"
      :depth="depth + 1"
      v-on:post="reload"
      :flagShowingComment="false"
    >
    </tree-comment>
  </div>
</template>

<script>

import treeComment from '../tree-comment'

export default {
  name: "partialReviewList",
  props: {
    reviews: Array,
    depth: Number,
    socket: {}
  },
  components: {
    treeComment
  },
  methods: {
    reload() {
      this.$emit('post')
    }
  }
}
</script>

<style scoped>

</style>
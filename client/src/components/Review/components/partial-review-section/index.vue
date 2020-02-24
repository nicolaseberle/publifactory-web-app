<template>
  <div>
    <div v-if="reviews">
      <tree-comment
        v-for="(review, key) in reviews"
        :key="key"
        :nodes="review.child"
        v-on:post="reload"
        :depth="1"
        :socket="socket"
        :reviewId="review._id"
        :label="review.content"
        :scores="review.scores"
        :creationDate="review.createdAt"
        :reviewType="review.type"
        :anonymous="review.anonymous"
        :user="review.userId"
        :flagShowingComment="false"
      ></tree-comment>
    </div>
    <partial-review-edit
      v-show="userArticleRight !== 'author'"
      v-on:newReport="newReport"
      :articleId="articleId"
    ></partial-review-edit>
  </div>
</template>

<script>
import { Socket } from 'net';
import treeComment from './components/tree-comment';
import partialReviewEdit from './components/partial-review-edit';
import { mapGetters } from 'vuex';

export default {
  name: 'partialReviewSection',
  props: {
    reviews: Array,
    socket: {},
    articleId: String
  },
  components: {
    treeComment,
    partialReviewEdit
  },
  computed: {
    ...mapGetters(['userArticleRight'])
  },
  methods: {
    reload() {
      this.$emit('post');
    },
    newReport(data) {
      this.$emit('newReport', data);
    }
  }
};
</script>
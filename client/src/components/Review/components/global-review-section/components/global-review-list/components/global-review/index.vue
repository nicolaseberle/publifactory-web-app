<template>
  <article>
    <global-review-header
      :anonymous="globalReview.anonymous"
      :user="globalReview.user"
      :type="globalReview.type"
      :createdAt="globalReview.createdAt"
    ></global-review-header>
  </article>
</template>

<script>
import globalReviewHeader from './components/global-review-header';

export default {
  name: 'globalReview',
  components: {
    globalReviewHeader
  },
  props: {
    globalReview: Object
  }
};
</script>

<style scoped>
</style>
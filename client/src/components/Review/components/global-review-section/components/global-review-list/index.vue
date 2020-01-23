<template>
  <div>
    <global-review
      v-for="(globalReview, key) in globalReviews"
      :key="key"
      :globalReview="globalReview"
    ></global-review>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import globalReview from './components/global-review';

export default {
  name: 'globalReviewList',
  props: {
    articleId: String
  },
  components: {
    globalReview
  },
  computed: {
    ...mapGetters(['globalReviews'])
  },
  async created() {
    try {
      console.log('ARTICLEID=>', this.articleId);
      await this.getGlobalReviews({
        articleId: this.articleId
      });
      console.log('====>', this.globalReviews);
    } catch (error) {
      console.warn('error=>', error);
    }
  },
  methods: {
    ...mapActions(['getGlobalReviews'])
  }
};
</script>

<style scoped>
</style>
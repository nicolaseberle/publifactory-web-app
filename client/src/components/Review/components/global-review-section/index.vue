<template>
  <section>
    <div>
      <global-review-list :articleId="articleId"></global-review-list>
      <global-review-form :articleId="articleId"></global-review-form>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import globalReviewForm from './components/global-review-form';
import globalReviewList from './components/global-review-list';
export default {
  name: 'globalReviewSection',
  components: {
    globalReviewForm,
    globalReviewList
  },
  data() {
    return {
      articleId: undefined
    };
  },
  async created() {
    this.articleId = this.$route.params && this.$route.params.id;
  },
  computed: {
    ...mapGetters(['userId', 'roles', 'accessToken'])
  }
};
</script>

<style scoped></style>

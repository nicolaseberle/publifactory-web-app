<template>
  <article>
    <div class="global-review-container">
      <global-review-header
        :anonymous="globalReview.anonymous"
        :user="globalReview.user"
        :type="globalReview.type"
        :createdAt="globalReview.createdAt"
      ></global-review-header>
      <global-review-slider
        class="global-review-slider-display"
        v-for="(score, key) in scores"
        :key="key"
        :score="score"
        :disabled="false"
      ></global-review-slider>
      <p class="global-review-label">Message to the Author(s)</p>
      <p
        class="global-review-content"
        v-if="globalReview.contentForAuthor"
        v-html="globalReview.contentForAuthor"
      ></p>
      <p class="global-review-label">Message to the Editor(s)</p>
      <p
        class="global-review-content"
        v-if="globalReview.contentForEditor"
        v-html="globalReview.contentForAuthor"
      ></p>
    </div>
  </article>
</template>

<script>
import globalReviewHeader from './components/global-review-header';
import globalReviewSlider from '../../../global-review-slider';

export default {
  name: 'globalReview',
  props: {
    globalReview: Object
  },
  data() {
    return {
      scores: null
      // textAuthorRef: `textAuthor${this.globalReview._id}`,
      // textEditorRef: `textEditor${this.globalReview._id}`
    };
  },
  components: {
    globalReviewHeader,
    globalReviewSlider
  },
  created() {
    this.scores = Object.entries(this.globalReview.scores).map(t => {
      return {
        label: `${t[0].charAt(0).toUpperCase()}${t[0].slice(1)}`,
        value: t[0],
        score: t[1]
      };
    });
  }
};
</script>

<style scoped>
p {
  margin: 0px;
}

.global-review-label {
  align-self: center;
}
.global-review-container {
  display: flex;
  flex-direction: column;
}
.global-review-content {
  overflow: auto;
  /* height: 400px; */
  margin-left: 3px;
  margin-right: 3px;
  border: 1px solid #ccc;
}
.global-review-slider-display {
  width: 100%;
}
</style>
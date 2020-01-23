<template>
  <article>
    <div class="global-review-form-container">
      <span class="global-review-form-message">Message for the Author(s) :</span>
      <global-review-input></global-review-input>
      <span class="global-review-form-message">Message for the Editor(s) :</span>
      <global-review-input></global-review-input>
      <global-review-slider v-for="(score, key) in scores" :key="key" :score="score"></global-review-slider>
      <div class="global-review-form-slider-container">
        <el-radio
          class="global-review-form-slider"
          v-model="type"
          label="validate"
        >I accept the publication of this article</el-radio>
        <el-radio
          class="global-review-form-slider"
          v-model="type"
          label="reject"
        >I decline the publication of this article</el-radio>
      </div>
      <el-button @click="submitGlobalReview">Submit</el-button>
    </div>
  </article>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import globalReviewSlider from './components/global-review-slider';
import globalReviewInput from './components/global-review-input';
const defaultScore = [
  { label: 'Innovation', value: 'innovation', score: 0 },
  { label: 'Reproducibility', value: 'reproducibility', score: 0 },
  { label: 'Writting', value: 'writting', score: 0 },
  { label: 'Rigor', value: 'rigor', score: 0 },
  { label: 'Stats', value: 'stats', score: 0 },
  { label: 'Quality', value: 'quality', score: 0 }
];
export default {
  name: 'globalReviewForm',
  components: {
    globalReviewSlider,
    globalReviewInput
  },
  props: {
    articleId: String
  },
  data() {
    return {
      scores: Object.assign([], defaultScore),
      type: 'validate'
    };
  },
  methods: {
    ...mapActions(['addGlobalReview']),
    async submitGlobalReview() {
      const child = this.$children.filter(child => {
        if (child.$options.name === 'globalReviewInput') return child;
      });
      console.log(child);
      const scores = this.scores.reduce((acc, { value, score }) => {
        return { ...acc, [value]: score };
      }, {});
      const globalReview = {
        anonymous: false,
        contentForAuthor: child[0].editor.root.innerHTML,
        contentForEditor: child[1].editor.root.innerHTML,
        type: this.type,
        userId: this.userId,
        scores
      };
      try {
        this.addGlobalReview({
          articleId: this.articleId,
          globalReview
        });
        this.scores = Object.assign([], defaultScore);
        child[0].editor.root.innerHTML = '';
        child[1].editor.root.innerHTML = '';
        this.type = 'validate';
      } catch (error) {
        console.warn(error);
      }
    }
  }
};
</script>

<style scoped>
.global-review-form-message {
  align-self: center;
}
.global-review-form-container {
  padding: 0px 10px 0px 10px;
  display: flex;
  flex-direction: column;
}
.global-review-form-slider {
  padding: 0px 0px 10px 0px;
}
.global-review-form-slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px 10px 0px;
}
.el-radio {
  margin-right: 0px;
}
</style>
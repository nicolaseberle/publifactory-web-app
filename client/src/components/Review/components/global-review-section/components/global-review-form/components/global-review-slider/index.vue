<template>
  <div class="global-review-slider-container">
    <span class="global-review-slider-label">{{ score.label }} :</span>
    <el-slider class="global-review-slider" v-model="score.score" :min="min" :max="max" show-stops></el-slider>
  </div>
</template>

<script>
export default {
  name: 'globalReviewSlider',
  props: {
    score: Object
  },
  data() {
    return {
      min: 0,
      max: 5
    };
  }
};
</script>

<style scoped>
.global-review-slider-container {
  display: flex;
  flex-direction: row;
}
.global-review-slider {
  padding: 0px 20px 0px 20px;
  width: 70%;
}
.global-review-slider-label {
  width: 30%;
  padding-top: 3px;
}
</style>

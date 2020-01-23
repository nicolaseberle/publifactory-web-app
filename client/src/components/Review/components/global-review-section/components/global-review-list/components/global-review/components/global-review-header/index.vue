<template>
  <div class="global-review-header">
    <span v-if="!anonymous">{{user.firstname}} {{user.lastname}}</span>
    <span v-if="anonymous"></span>
    <span class="font-dnltp-regular font-style-normal">
      <time datetime="2017-02-23">{{ createdAt | moment("DD/MM/YYYY - LT") }}</time>
    </span>
    <el-tag :class="type">{{type}}</el-tag>
  </div>
</template>

<script>
export default {
  name: 'globalReviewHeader',
  props: {
    anonymous: Boolean,
    user: Object,
    type: String,
    createdAt: String
  }
};
</script>

<style scoped>
.global-review-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.validate {
  width: 16%;
  text-align: center;
  background-color: yellowgreen;
  color: #333;
}
.reject {
  width: 16%;
  text-align: center;
  background-color: red;
  color: #f3f3f3;
}
</style>

<template>
  <header>
    <a
      v-if="anonymous==false"
      href="#"
      title="OSPR's profile"
    >{{ user.firstname}} {{ user.lastname}}</a>
    <a v-if="anonymous" href="#" title="OSPR's profile">Reviewer 1</a>
    <p class="font-dnltp-regular font-style-normal">
      <time datetime="2017-02-23">{{ creationDate | moment("DD/MM/YYYY - LT") }}</time>
    </p>
    <p class="font-dnltp-regular font-style-normal">
      <time datetime="2017-02-23"></time>
    </p>
    <div v-show="reviewType !='reply' ">
      <el-tag :class="reviewType" v-if="reviewType">{{ displayReviewType }}</el-tag>
    </div>
  </header>
</template>

<script>
export default {
  name: 'partialReviewHeader',
  props: {
    user: Object,
    anonymous: Boolean,
    creationDate: String,
    reviewType: String
  },
  computed: {
    displayReviewType() {
      switch (this.reviewType) {
        case 'comment':
          return 'Comment';
        case 'minor-revision':
          return 'Minor Revision';
        case 'major-revision':
          return 'Major Revision';
        case 'rejection':
          return 'Rejection';
        case 'no-revision':
          return 'No Revision';
        case 'resolve':
          return 'Resolve';
        default:
          return 'Comment';
      }
    }
  }
};
</script>

<style scoped>
</style>
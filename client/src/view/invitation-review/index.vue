<template>
  <div>
    <p>{{call}} {{status}}</p>
    <p>Not implemented</p>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'invitationReview',
  data() {
    return {
      articleId: '',
      status: '',
      call: ''
    };
  },
  computed: {
    ...mapGetters(['userId', 'accessToken'])
  },
  async mounted() {
    if (!this.userId || !this.accessToken) {
      // create guessAccount then => UI
    } else {
    }
  },
  async created() {
    this.status = this.$route.params.status;
    this.articleId = this.$route.params.articleId;
    const response = await axios({
      method: 'post',
      url: `/api/publish-workflow/author/${this.articleId}/${this.status}`,
      validateStatus: undefined,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    this.call = response.status !== 200 ? 'ko' : 'ok';
  }
};
</script>

<style>
</style>

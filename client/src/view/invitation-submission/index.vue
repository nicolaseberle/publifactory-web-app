<template>
  <div>
    <p>{{call}} {{status}}</p>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'invitationSubmission',
  data() {
    return {
      articleId: '',
      journalId: '',
      status: '',
      call: ''
    };
  },
  computed: {
    ...mapGetters(['userId', 'accessToken'])
  },
  async created() {
    this.status = this.$route.params.status;
    this.articleId = this.$route.params.articleId;
    this.journalId = this.$route.params.journalId;
    const response = await axios({
      method: 'post',
      url: `/api/publish-workflow/author/${this.journalId}/${this.articleId}/${this.status}`,
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

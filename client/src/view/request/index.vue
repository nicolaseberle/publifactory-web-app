<template>
  <div class="request-background">
    <div class="request-container">
      <div class="request-center-middle request-title">
        <a href="/" class="router-link-exact-active active">
          <h4>PubliFactory</h4>
        </a>
      </div>
      <div class="request-center-middle">
        <div>
          <h4>Thanks for replying,</h4>
        </div>
        <div v-if="status === 'accepted'">
          <h4>We will put you in touch with the publisher.</h4>
        </div>
        <div v-else-if="status === 'rejected'">
          <h4>Perhaps another time.</h4>
        </div>
        <div v-else-if="status === 'outfield'">
          <h4>Sorry, we thought that this article could have match your interests.</h4>
        </div>
        <div v-else>
          <h4>The request has already been answered.</h4>
          <h4>You can contact pub@pub.co.</h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'RequestView',
  data() {
    return {
      requestId: '',
      status: '',
      request: null
    };
  },
  async created() {
    this.status = this.$route.params.status;
    this.requestId = this.$route.params.requestId;
    const response = await axios({
      method: 'post',
      url: `/api/requests/${this.requestId}/${this.status}/`,
      validateStatus: undefined
    });
    if (
      response.status === 500 &&
      !response.data.success &&
      response.data.message === 'REQUEST_ALREADY_DONE'
    ) {
      this.status = 'done';
      return;
    }
    this.request = response.data;
    this.status = this.request.history.slice(-2, -1)[0].status;
  }
};
</script>

<style>
.request-background {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: #ededda;
  justify-content: center;
}
.request-container {
  height: 30%;
  width: 30%;
  margin-top: 100px;
  padding: 0px 20px 20px 20px;
  background-color: #304156;
  color: #f8f8f8;
  border-radius: 15px;
}
.request-center-middle {
  text-align: center;
}
.request-title {
  font-size: 24px;
}
</style>

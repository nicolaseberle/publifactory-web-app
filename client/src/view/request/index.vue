<template>
  <div class="request-background">
    <div class="request-container">
      <div class="request-center-middle request-title">
        <a href="/" class="router-link-exact-active active">
          <h4>PubliFactory</h4>
        </a>
      </div>
      <div class="request-text-center">
        <h4>Thanks for replying,</h4>
        <div v-if="status === 'accepted'">
          <h4>We will put you in touch with the publisher.</h4>
        </div>
        <div v-else-if="status === 'rejected'">
          <h4>Perhaps another time.</h4>
        </div>
        <div v-else-if="status === 'outfield'">
          <h4>Sorry, we thought that this article could match your interests.</h4>
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
    // this.request = {
    //   reviewer: {
    //     semanticScholarId: '1324',
    //     email: 'quentin.collin@epitech.eu',
    //     name: 'Quentin(R)'
    //   },
    //   editor: {
    //     name: 'editorName',
    //     email: 'quentin.collin@epitech.eu',
    //     journal: 'journalName'
    //   },
    //   remindMax: 4,
    //   remindCount: 0,
    //   history: [
    //     {
    //       status: 'pending',
    //       date: 'Tue, 12 Nov 2019 09:33:18 GMT'
    //     },
    //     {
    //       status: 'sent',
    //       date: 'Tue, 12 Nov 2019 09:33:19 GMT'
    //     },
    //     {
    //       status: 'read',
    //       date: 'Tue, 12 Nov 2019 09:33:24 GMT'
    //     },
    //     {
    //       status: 'rejected',
    //       date: 'Tue, 12 Nov 2019 09:33:25 GMT'
    //     },
    //     {
    //       status: 'done',
    //       data: 'Tue, 12 Nov 2019 09:33:25 GMT'
    //     }
    //   ],
    //   _id: '5dca7c5edfa25c0791315557',
    //   title: 'New consomption of energy',
    //   abstract: 'ABSTRACT WILL BE PUT HERE',
    //   deadline: '2019-10-30T13:32:51.000Z',
    //   object: 'Review article from journal Editor',
    //   content:
    //     "<h4>Dear Dr Rera, I would like to invite you to review the above-referenced manuscript. To maintain our journal's high standards we need the best reviewers, and given your expertise in this area I would greatly appreciate your contribution. I kindly ask you to give this review invitation the same consideration that you would want one of your own manuscripts to receive.</h4>",
    //   remind: 'code',
    //   createdAt: '2019-11-12T09:33:18.639Z',
    //   updatedAt: '2019-11-12T09:33:25.897Z',
    //   __v: 1
    // };
    // this.status = this.request.history.slice(-2, -1)[0].status;
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
      response.data.message === 'REAQUEST_ALREADY_DONE'
    ) {
      return;
    }
    this.request = response.data;
    this.status = this.request.history.slice(-2, -1)[0].status;
  }
};
</script>

<style scoped>
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
  width: 40%;
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
.request-text-center {
  text-align: center;
}
</style>

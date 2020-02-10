<template>
  <div class="request-background">
    <div class="request-container">
      <div class="request-center-middle">
        <div v-if="status === 'accepted'">
          <h4>We added {{associateEditor.firstname}} {{associateEditor.lastname}} as a new associate editor</h4>
          <!-- <h4>If this was a mistake you can still remove his right from your journal by clicking here :</h4> -->
        </div>
        <div v-else-if="status === 'rejected'">
          <h4>Thanks for replying</h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
export default {
  name: 'approvals',
  data() {
    return {
      associateEditor: {
        name: '',
        firstname: '',
        lastname: ''
      }
    };
  },
  async created() {
    this.status = this.$route.params.status;
    this.journalId = this.$route.params.journalId;
    this.userId = this.$route.params.userId;
    try {
      const associateEditorRole = await this.addAssociateEditor();
      this.associateEditor = await this.getAssociateEditor(associateEditorRole);
    } catch (error) {
      console.warn(error);
    }
  },
  methods: {
    async getAssociateEditor(userId) {
      const response = await axios({
        method: 'get',
        url: `/api/users/${userId}`,
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      if (
        response.status === 500 &&
        !response.data.success &&
        response.data.message === 'REQUEST_ALREADY_DONE'
      ) {
        throw new Error('GET_USER_FAILED');
      }
      return response.data;
    },
    async addAssociateEditor() {
      const response = await axios({
        method: 'put',
        url: `/api/journals/${this.journalId}/addAssociateEditor/`,
        validateStatus: undefined,
        data: {
          userId: this.userId
        },
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      if (
        response.status === 500 &&
        !response.data.success &&
        response.data.message === 'REQUEST_ALREADY_DONE'
      ) {
        throw new Error('ADD_ASSOEDITOR_FAILED');
      }
      return response.data.user.id_user;
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  }
};
</script>

<style>
.request-background {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: #fff;
  justify-content: center;
}
.request-container {
  height: 30%;
  width: 50%;
  margin-top: 40px;
  padding: 0px 20px 20px 20px;
  background-color: #f4f4f4;
  color: #333;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.request-center-middle {
  text-align: center;
}
.request-center-middle h4 {
  font-family: 'DNLTPro-regular';
  font-size: 1.2rem;
}
.request-title {
  font-size: 24px;
}
/* Put your css in here */
.input-bar {
  display: table;
  width: 100%;
}

.input-bar-item {
  display: table-cell;
}

.input-bar-item > button {
  margin-left: 5px;
}

.width100 {
  width: 100%;
}
</style>

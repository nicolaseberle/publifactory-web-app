<template>
  <div class="approval-background">
    <div class="approval-container">
      <div class="approval-center-middle">
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
      },
      journalId: '',
      status: '',
      userId: '',
      requestId: ''
    };
  },
  async created() {
    this.status = this.$route.params.status;
    this.journalId = this.$route.params.journalId;
    this.userId = this.$route.params.userId;
    this.requestId = this.$route.params.requestId;
    try {
      const associateEditorRole = await this.addAssociateEditor();
      this.associateEditor = await this.getAssociateEditor(associateEditorRole);
    } catch (error) {
      console.warn(error);
    }
  },
  methods: {
    // async
    approveRequest() {
      axios({
        method: 'post',
        url: `/api/requests/${this.requestId}`,
        headers: { Authorization: `Bearer ${this.accessToken}` },
        data: {
          status: 'pending'
        }
      }).then(response => {
        console.log(response.status);
      });
    },
    async getAssociateEditor(userId) {
      try {
        const response = await axios({
          method: 'get',
          url: `/api/users/${userId}`,
          headers: { Authorization: `Bearer ${this.accessToken}` }
        });
        return response.data;
        this.approveRequest();
      } catch (error) {
        console.warn(error);
      }
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
      return response.data.user.id_user;
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  }
};
</script>

<style>
.approval-background {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: #fff;
  justify-content: center;
}
.approval-container {
  height: 30%;
  width: 50%;
  margin-top: 40px;
  padding: 0px 20px 20px 20px;
  background-color: #f4f4f4;
  color: #333;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.approval-center-middle {
  text-align: center;
}
.approval-center-middle h4 {
  font-family: 'DNLTPro-regular';
  font-size: 1.2rem;
}
.approval-title {
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

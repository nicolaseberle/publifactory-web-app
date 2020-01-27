<template>
  <div class="request-background">
    <div class="request-container">
      <div class="request-center-middle">
        <div v-if="status === 'accepted'">
          <h4>Thanks for replying,</h4>
          <h4>The publisher will get back to you shortly</h4>
        </div>
        <div v-else-if="status === 'rejected'">
          <h4>Thanks for replying, perhaps another time.</h4>
          <h4>Please let us know if you think of someone who might be interested by the present article.</h4>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label='Email/Name' prop="email">
            <div class="input-bar">
              <div class="input-bar-item width100">
                <form>
                   <div class="form-group">
                      <el-input class="form-control width100" v-model="form.email"></el-input>
                  </div>
                </form>
              </div>
              <div class="input-bar-item">
                <el-button type="primary"  @click="submitForm('ruleForm')">Send</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
        </div>
        <div v-else-if="status === 'outfield'">
          <h4>Thanks for replying,</h4>
          <h4>Sorry, we thought that this article could have match your interests.</h4>
        </div>
        <div v-else>
          <h4>The request has already been answered.</h4>
          <h4>You can contact contact@publifactory.co</h4>
          <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label='Email/Name' prop="email">
              <div class="input-bar">
                <div class="input-bar-item width100">
                  <form>
                     <div class="form-group">
                        <el-input class="form-control width100" v-model="form.email"></el-input>
                    </div>
                  </form>
                </div>
                <div class="input-bar-item">
                  <el-button type="primary" @click="submitForm('ruleForm')">Send</el-button>
                </div>
              </div>
            </el-form-item>
          </el-form>
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
      form: {email:''},
      rules: {
          email: { required: true, message: 'Please input Activity name', trigger: 'blur' }
      },
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
  },
  methods: {
    submitForm () {

    }
  }
};
</script>

<style>
.request-background {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: #FFF;
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
.request-center-middle h4{
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

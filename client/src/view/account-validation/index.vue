<template>
  <div class="account-validation-background">
    <div class="account-validation-container">
      <div v-show="!toggleLoader && !done" class="account-validation-center-middle">
        <p>To finalize your account, you need a password for your account :</p>
        <el-input type="password" placeholder="Entrez your password" v-model="password"></el-input>
        <div class="account-validation-submit">
          <el-button :disabled="password.length === 0" type="primary" @click="submit('create')">
            <span>submit</span>
          </el-button>
        </div>
        <div class="account-validation-submit">
          <span>If you want to delete this acccount:</span>
          <el-button type="danger" @click="submit('delete')">delete</el-button>
        </div>
      </div>
      <div v-show="toggleLoader && !done" class="account-validation-loader">
        <div v-show="toggleLoader" class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div v-show="done" class="account-validation-center-middle">
        <div v-show="done">{{messageDone}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'accountValidation',
  data() {
    return {
      token: '',
      password: '',
      toggleLoader: false,
      done: false,
      messageDone: ''
    };
  },
  async created() {
    this.token = this.$route.params.token;
  },
  methods: {
    async submit(action) {
      this.toggleLoader = !this.toggleLoader;
      try {
        const response = await axios({
          method: 'post',
          url: `/api/users/validate-guest/${action}`,
          data: {
            password: this.password,
            token: this.token
          }
        });
      } catch (error) {
        this.messageDone = `An error occured`;
        this.done = true;
      }
      this.toggleLoader = !this.toggleLoader;
      this.messageDone = `Account successfully ${
        action === 'create' ? 'created' : 'deleted'
      }`;
      this.done = true;
      this.$router.push(this.$route.query.redirect || '/login');
    }
  }
};
</script>

<style>
.account-validation-background {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: #fff;
  justify-content: center;
}
.account-validation-container {
  height: 30%;
  width: 50%;
  margin-top: 40px;
  padding: 20px 20px 20px 20px;
  background-color: #f4f4f4;
  color: #333;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.account-validation-submit {
  padding: 10px 0px 0px 0px;
  display: flex;
  justify-content: center;
}

.account-validation-loader {
  height: 200px;
  width: 200px;
  display: flex;
  justify-content: center;
}

.account-validation-center-middle {
  text-align: center;
}
.account-validation-center-middle h4 {
  font-family: 'DNLTPro-regular';
  font-size: 1.2rem;
}
.account-validation-title {
  font-size: 24px;
}

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

.lds-ring {
  transform: translate(300px, 30%);
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 16px solid #66b1ff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #66b1ff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

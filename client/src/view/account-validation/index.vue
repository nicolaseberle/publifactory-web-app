<template>
  <div class="account-validation-background">
    <div class="account-validation-container">
      <div class="account-validation-center-middle">add</div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
export default {
  name: 'accountValidation',
  data() {
    return {};
  },
  async created() {
    this.token = this.$route.params.token;
  },
  methods: {
    async submit() {
      const response = await axios({
        method: 'get',
        url: `/api/users/validate-guest`,
        data: {
          password: 'toto',
          token: this.token
        }
      });
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
  padding: 0px 20px 20px 20px;
  background-color: #f4f4f4;
  color: #333;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

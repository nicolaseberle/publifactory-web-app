<template>
  <div class="free-plan-container">
    <p class="free-plan-align-center-title">
      <strong>Free Plan</strong>
    </p>
    <div>
      <div>
        <div class="free-plan-content">
          <span>Requests</span>
          <span>{{ this.invitationNumber }} / 10</span>
        </div>
        <el-progress
          :show-text="false"
          :stroke-width="strokeWidth"
          :percentage="computedPercentage"
          type="line"
          status="exception"
        ></el-progress>
      </div>
    </div>
    <div class="free-plan-button-container">
      <el-button @click="upgrade" type="danger" :disabled="true">Upgrade</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// To get cookies : this.$cookie.get("maxInvitation");

export default {
  name: "freePlanStatusBar",
  props: {
    strokeWidth: {
      type: Number,
      default: 10
    },
    maxInvitation: {
      type: Number
    }
  },
  data() {
    return {
      computedPercentage: this.maxInvitation * 10,
      invitationNumber: this.maxInvitation
    };
  },
  methods: {
    upgrade() {
      this.$emit("onUpgrade");
    }
  },
  watch: {
    maxInvitation: {
      immediate: true,
      handler(val) {
        if (Number.isNaN(val)) {
          this.invitationNumber = 0;
          this.computedPercentage = this.invitationNumber * 10;
          return;
        }
        this.computedPercentage = val * 10;
        this.invitationNumber = val;
        return;
      }
    }
  }
};
</script>

<style scoped>
.free-plan-container {
  display: flex;
  flex-direction: column;
}

.free-plan-align-center-title {
  align-self: center;
  margin: 4px;
}

.free-plan-button-container {
  align-self: center;
  padding: 10px 5px 5px 5px;
}

.free-plan-content {
  display: flex;
  justify-content: space-between;
  padding: 0px 5px 3px 5px;
}
</style>

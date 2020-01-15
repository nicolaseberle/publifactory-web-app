<template>
	<!-- <div v-if="!loggedIn" class="free-plan-container"> -->
	<div class="free-plan-container">
		<!--<p class="free-plan-align-center-title"><strong>Free Plan</strong></p>-->
		<p><el-button type="success"  size="mini" icon="el-icon-check" circle></el-button> Are you sure to invite this reviewer ?</p>
		<div>
			<div class="free-plan-box">
				<p><b>Free Plan</b></p>
				<div class="free-plan-content" style='font-size:11px'>
					<span>Requests</span>
					<span>{{ this.maxInvitation }} / 10</span>
				</div>
				<el-progress
					:show-text="false"
					:stroke-width="strokeWidth"
					:percentage="computedPercentage"
					type="line"
					status="exception"
				>
				</el-progress>
				<div class="free-plan-content" style='font-size:11px'>
					<span>Monthly requests reset in 9 days.</span>
				</div>
			</div>
		</div>
		<!--
		<div class="free-plan-button-container">
			<el-button @click="upgrade" type="danger" :disabled="true"
				>Upgrade</el-button
			>
		</div>-->
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
.free-plan-box{
	padding: 10px 5px 3px 5px;
}
.free-plan-content {
	display: flex;
	justify-content: space-between;
	padding: 10px 0px 5px 0px;
}
</style>

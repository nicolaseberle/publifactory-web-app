<template>
	<!-- <div v-if="!loggedIn" class="free-plan-container"> -->
	<div class="free-plan-container">
		<!--<p class="free-plan-align-center-title"><strong>Free Plan</strong></p>-->
		<div>
			<div class="free-plan-box">
				<div class="free-plan-content" style='font-size:11px'>
					<span>Request {{ this.maxInvitation }} out of your 10 free requests</span>
					<span>{{ this.maxInvitation }} / 10</span>
				</div>
				<el-progress
					:show-text="false"
					:stroke-width="strokeWidth"
					:percentage="computedPercentage"
					:color="colors"
					type="line"
				>
				</el-progress>
				<div class="free-plan-content" style='font-size:11px'>
					<span>Monthly requests reset in {{remainingDay}} days.</span>
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
	name: "quotaRequestBox",
	props: {
		strokeWidth: {
			type: Number,
			default: 8
		},
		maxInvitation: {
			type: Number
		},
		remainingDay: {
			type: Number
		},

	},
	data() {
		return {
			computedPercentage: this.maxInvitation * 10,
			invitationNumber: this.maxInvitation,
			colors: [
				{color: '#5cb87a', percentage: 60},
				{color: '#5cb87a', percentage: 80},
				{color: '#f56c6c', percentage: 100}
			]
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
	 },
	created() {
		// this.invitatioNumber	 = this.$cookie.get("maxInvitation");
	}
};
</script>

<style scoped>
.free-plan-container {
	display: flex;
	flex-direction: column;
	line-height: 16px;
	width: 100%;
	margin-left:40px;
	margin-right:20px;
}

.free-plan-align-center-title {
	align-self: center;
	margin: 4px;
}

.free-plan-button-container {
	align-self: center;
	padding: 5px 5px 5px 5px;
}
.free-plan-box{
	padding: 5px 5px 3px 5px;
}
.free-plan-content {
	display: flex;
	justify-content: space-between;
	padding: 5px 0px 5px 0px;
}
</style>

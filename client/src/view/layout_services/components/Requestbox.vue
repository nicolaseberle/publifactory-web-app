<template>
	<!-- <div v-if="!loggedIn" class="free-plan-container"> -->
	<div class="free-plan-container">
		<!--<p class="free-plan-align-center-title"><strong>Free Plan</strong></p>-->

		<div>
			<div class="free-plan-box">
				<span><b>Free Plan</b></span>
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

		<div class="free-plan-button-container-footer">
			<el-button @click="upgrade" type="danger"
				>Upgrade my plan</el-button
			>
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
			default: 8
		},
		maxInvitation: {
			type: Number
		}
	},
	data() {
		return {
			computedPercentage: 0
		};
	},
	methods: {
		upgrade() {
			this.$emit("onUpgrade");
		}
	},
	watch: {
		maxInvitation: function(val) {
			this.computedPercentage = val * 10;
			console.log("==>", val, this.computedPercentage);
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
	width:240px;
	line-height: 16px;
}


.free-plan-button-container-footer {
	text-align: right;
	padding: 5px 5px 20px 5px;
}
.free-plan-box{
	padding: 5px 5px 3px 5px;
}
.free-plan-content {
	display: flex;
	justify-content: space-between;
	padding: 10px 0px 5px 0px;
}
</style>

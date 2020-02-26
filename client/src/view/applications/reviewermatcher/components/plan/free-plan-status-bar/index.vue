<template>
	<!-- <div v-if="!loggedIn" class="free-plan-container"> -->
	<div class="free-plan-container">
		<!--<p class="free-plan-align-center-title"><strong>Free Plan</strong></p>-->
		<div>
			<div class="free-plan-box mv3 bw2 bl bg-lightest-light-blue">
				<div class="free-plan-content" style='font-size:11px'>
					<span><b>Free Plan</b> - Request {{Math.min(this.maxInvitation,10) }} out of your 10 free requests</span>
					<span>{{Math.min(this.maxInvitation,10) }} / 10</span>
				</div>
				<el-progress
					:show-text="false"
					:stroke-width="8"
					:percentage="computedPercentage"
					:color="colors"
					type="line"
				>
				</el-progress>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

// To get cookies : this.$cookie.get("maxInvitation");

export default {
	name: "freePlanStatusBar",
	props: {
		maxInvitation: {
			type: Number
		}
	},
	data() {
		return {
			computedPercentage: Math.min(this.maxInvitation,10) * 10,
			invitationNumber: Math.min(this.maxInvitation,10),
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
	          this.computedPercentage = Math.min(this.maxInvitation,10) * 10;
	          return;
	        }
	        this.computedPercentage = Math.min(val,10) * 10;
	        this.invitationNumber = Math.min(val,10) ;
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
.bg-lightest-light-blue {
    background-color: #F0F7FF;
}
.bl{
  border-left-style: solid;
}
.mv3{
  margin: 1rem 0;
  padding:  0.5rem 1rem ;
  border-radius: 2px;
}

.bw2 {
    border-width: 4px;
}
</style>

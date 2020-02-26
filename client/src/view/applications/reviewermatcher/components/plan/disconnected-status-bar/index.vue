<template>
	<!-- <div v-if="!loggedIn" class="disconnected-plan-container"> -->
	<div class="disconnected-plan-container">
		<!--<p class="disconnected-plan-align-center-title"><strong>disconnected Plan</strong></p>-->
		<div>
			<div class="disconnected-plan-box mv3 bw2 bl bg-lightest-light-blue">
				<div class="disconnected-plan-content" style='font-size:11px'>
					<span><b>Disconnected</b></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "disconnectedPlanStatusBar",
	data() {
		return {

		}
	},
	methods: {

	},
	watch: {
	 },
	created() {

	}
};
</script>

<style scoped>
.disconnected-plan-container {
	display: flex;
	flex-direction: column;
	line-height: 16px;
	margin-left:40px;
	margin-right:20px;
}

.disconnected-plan-align-center-title {
	align-self: center;
	margin: 4px;
}

.disconnected-plan-button-container {
	align-self: center;
	padding: 5px 5px 5px 5px;
}
.disconnected-plan-box{
	padding: 5px 5px 3px 5px;
}
.disconnected-plan-content {
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

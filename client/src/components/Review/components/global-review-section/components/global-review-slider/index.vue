<template>
	<div class="global-review-slider-container">
		<span>{{ score.label }}</span>
		<el-slider
			v-model="score.score"
			:min="min"
			:max="max"
			show-stops
		></el-slider>
	</div>
</template>

<script>
export default {
	name: 'globalReviewSlider',
	props: {
		score: Object
	},
	data() {
		return {
			model: 2,
			min: 0,
			max: 10
		};
	},
	created() {
		console.log(this.$parent);
	}
};
</script>

<style scoped>
.global-review-slider-container {
	padding: 0px 20px 0px 20px;
}
</style>

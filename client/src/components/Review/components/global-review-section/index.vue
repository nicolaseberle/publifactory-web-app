<template>
	<article>
		<section>
			<div>
				<global-review-slider
					v-for="(score, key) in scores"
					:key="key"
					:score="score"
				></global-review-slider>
				<el-button @click="submitGlobalReview">Submit</el-button>
			</div>
		</section>
	</article>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import globalReviewSlider from './components/global-review-slider';

const defaultScore = [
	{ label: 'Innovation', value: 'innovation', score: 0 },
	{ label: 'Reproducibility', value: 'reproducibility', score: 0 },
	{ label: 'Writting', value: 'writting', score: 0 },
	{ label: 'Rigor', value: 'rigor', score: 0 },
	{ label: 'Stats', value: 'stats', score: 0 },
	{ label: 'Quality', value: 'quality', score: 0 }
];

export default {
	name: 'globalReviewSection',
	components: {
		globalReviewSlider
	},
	data() {
		return {
			globalReviews: [],
			artileId: this.$route.params && this.$route.params.id,
			scores: Object.assign({}, defaultScore)
		};
	},
	computed: {
		...mapGetters(['userId', 'roles', 'accessToken'])
	},
	methods: {
		async submitGlobalReview() {
			console.log(JSON.stringify(this.scores));
			const globalReview = {
				anonymous: false,
				content: 'toto',
				userId: this.userId,
				scores: {
					...this.scores.map(({ value, score }) => {
						value, score;
					})
				}
			};
			console.log('==>', globalReview);
			try {
				const response = await axios.post(
					`/api/global-review/${this.articleId}`,
					globalReview,
					{
						headers: { Authorization: `Bearer ${this.accessToken}` }
					}
				);
				console.log('post create=>', response.data);
				this.globalReviews.push(response.data);
				this.scores = Object.assign({}, defaultScore);
			} catch (error) {
				console.warn(error);
			}
		}
	}
};
</script>

<style scoped></style>

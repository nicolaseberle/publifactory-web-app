const mutations = {
	getGlobalReviews(state, { globalReviews }) {
		state.globalReviews = globalReviews;
	},
	addGlobalReview(state, { globalReview }) {
		state.globalReviews = [...state.globalReviews, globalReview];
	},
	deleteGlobalReview(state, { globalReviewId }) {
		state.globalReviews = state.globalReviews.reduce((acc, review) => {
			if (review._id !== globalReviewId) return acc.push(review);
		}, []);
	},
	updateGlobalReview(state, { globalReview }) {
		state.globalReviews = state.globalReviews.map(review => {
			if (review._id === globalReview._id) return globalReview;
			return review;
		});
	}
};

export default mutations;

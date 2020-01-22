const mutations = {
	getPartialReviewsList(state, { partialReviews }) {
		console.log('MUTATION=>', state, partialReviews);
		state.partialReviews = partialReviews;
	}
};

export default mutations;

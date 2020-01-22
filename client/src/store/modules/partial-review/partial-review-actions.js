import axios from 'axios';

const actions = {
	async fetchPartialReviews({ commit, state }, payload) {
		try {
			console.log('mapactiopn=>', state);
			const response = await axios.get(
				`/api/comments/list/${payload.articleId}`,
				{
					headers: { Authorization: `Bearer ${payload.accessToken}` }
				}
			);
			commit('getPartialReviewsList', {
				partialReviews: response.data
			});
		} catch (error) {
			throw error;
		}
	}
};

export default actions;

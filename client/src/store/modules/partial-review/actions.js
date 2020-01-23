import axios from 'axios';

const actions = {
	async fetchPartialReviews({ commit, getters: { accessToken } }, payload) {
		try {
			const response = await axios.get(
				`/api/comments/list/${payload.articleId}`,
				{
					headers: { Authorization: `Bearer ${accessToken}` }
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

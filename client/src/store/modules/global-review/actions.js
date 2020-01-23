import axios from 'axios';
import uuidv4 from 'uuid/v4';
const actions = {
	async getGlobalReviews({ commit, getters: { accessToken } }, { articleId }) {
		const response = await axios.get(`/api/global-reviews/list/${articleId}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		commit('getGlobalReviews', {
			globalReviews: response.data
		});
	},
	async addGlobalReview(
		{ commit, getters: { accessToken } },
		{ articleId, globalReview }
	) {
		const response = await axios.post(
			`/api/global-reviews/${articleId}`,
			globalReview,
			{
				headers: { Authorization: `Bearer ${accessToken}` }
			}
		);
		commit('addGlobalReview', {
			globalReview: response.data
		});
	},
	async deleteGlobalReview(
		{ commit, getters: { accessToken } },
		{ articleId, globalReviewId }
	) {
		await axios.delete(`/api/global-reviews/${articleId}/${globalReviewId}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		commit('deleteGlobalReview', {
			globalReviewId
		});
	},
	async updateGlobalReview(
		{ commit, getters: { accessToken } },
		{ globalReview }
	) {
		await axios.put(`/api/global-reviews/${globalReview._id}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		commit('updateGlobalReview', {
			globalReview
		});
	}
};

export default actions;

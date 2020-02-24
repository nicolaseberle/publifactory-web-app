import axios from 'axios';

const actions = {
	async getUserArticleRight(
		{ commit, getters: { userId, accessToken } },
		{ articleId }
	) {
		const response = await axios.get(`/api/roles/articles/right/${articleId}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		commit('userArticleRight', {
			userArticleRight: response.data.right
		});
	}
};

module.exports = actions;

import axios from 'axios';

const actions = {
	async getUserArticleRight(
		{ commit, getters: { accessToken } },
		{ articleId }
	) {
		const response = await axios.get(`/api/roles/article/right/${articleId}`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		commit('userArticleRight', {
			userArticleRight: response.data.right
		});
	}
};

export default actions;

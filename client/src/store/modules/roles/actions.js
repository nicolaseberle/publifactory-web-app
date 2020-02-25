import axios from 'axios';

const actions = {
	async getUserRoles({ commit, getters: { accessToken } }) {
		const responseArticleRoles = await axios.get(
			`/api/roles/article/user/all/`,
			{
				headers: { Authorization: `Bearer ${accessToken}` }
			}
		);
		const responseJournalRoles = await axios.get(
			`/api/roles/journal/user/all/`,
			{
				headers: { Authorization: `Bearer ${accessToken}` }
			}
    );
		commit('journalRoles', {
			roles: responseJournalRoles.data.role
		});
		commit('articleRoles', {
			roles: responseArticleRoles.data.role
		});
	}
};

export default actions;

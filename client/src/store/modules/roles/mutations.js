const mutations = {
	articleRoles(state, { roles }) {
		state.articles = roles;
	},
	journalRoles(state, { roles }) {
		state.journals = roles;
	}
};

export default mutations;

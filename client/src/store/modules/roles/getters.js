const getters = {
	articleRoles: (state, getters) => {
		return state.articles;
	},
	journalRoles: state => {
		return state.journals;
	}
};

export default getters;

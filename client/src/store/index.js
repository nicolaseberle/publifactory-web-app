import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import routeLoading from './modules/route';
import errorLog from './modules/errorLog';
import permission from './modules/permission';
import config from './modules/global-config';
import user from './modules/user';
import getters from './getters';
import partialReview from './modules/partial-review';
import globalReviews from './modules/global-review';
import rights from './modules/rights';
import roles from './modules/roles';

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: false, // process.env.NODE_ENV !== 'production',
	modules: {
		app,
		errorLog,
		user,
		config,
		permission,
		routeLoading,
		partialReview,
		globalReviews,
		rights,
		roles
	},
	getters
});

export default store;

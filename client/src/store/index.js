import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import routeLoading from './modules/route'
import config from './modules/global-config'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    app,
    user,
    config,
    routeLoading
  },
  getters
})

export default store

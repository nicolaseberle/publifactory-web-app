import Vue from 'vue'
// read localStorage stored data
import './stored'
// locale
import './locales'

// router and store
import store from './store'
import router, { hook as routerHook } from './router'
import { sync } from 'vuex-router-sync'
sync(store, router)

// ui library

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.use(require('vue-moment'))

import './styles/index.scss' // global css

// ajax
import './http'

import * as filters from './filters' // global filters

const userPromise = store.dispatch('initUserInfo')
routerHook(userPromise)

// main component
import App from './App'

import './socket'

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

userPromise.then(() => {
  const app = new Vue({
    router,
    store,
    ...App // Object spread copying everything from App.vue
  })
  // actually mount to DOM
  app.$mount('app')
})

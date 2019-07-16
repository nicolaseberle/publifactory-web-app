import Vue from 'vue'
import Cookies from 'js-cookie'
// read localStorage stored data
import './stored'
// locale
// import './locales'
import './icons'
import './errorLog' // error log
// router and store
import store from './store'
import router, { hook as routerHook } from './router'
import { sync } from 'vuex-router-sync'
// import i18n from './lang' // Internationalization
import './locales'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons'

import VueSplit from 'vue-split-panel'
import Icon from 'vue-awesome/components/Icon'
import VueTextareaAutosize from 'vue-textarea-autosize'
import './styles/index.scss' // global css
import 'codemirror/lib/codemirror.css'
import 'quill-cursors/dist/quill-cursors.css'
// ajax
import './http'

import * as filters from './filters' // global filters
// main component
import App from './App'

sync(store, router)

// ui library

// import CKEditor from '@ckeditor/ckeditor5-vue';
// import VueQuill from 'vue-quill'
Vue.use(VueSplit)

Vue.component('v-icon', Icon)

Vue.use(VueTextareaAutosize)

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium'// set element-ui default size
  // i18n: (key, value) => i18n.t(key, value)
})
Vue.use(require('vue-moment'))

const userPromise = store.dispatch('initUserInfo')
routerHook(userPromise)

// import './socket'
// Vue.use( CKEditor );


// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

userPromise.then(() => {
  const app = new Vue({
    router,
    store,
    // i18n,
    ...App // Object spread copying everything from App.vue
  })
  // actually mount to DOM
  app.$mount('app')
})

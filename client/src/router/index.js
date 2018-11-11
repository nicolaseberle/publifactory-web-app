/**
 * App router config
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Layout from '../view/layout/Layout'
import componentsRouter from './modules/components'
// import otherModuleRoutes from './module'

Vue.use(VueRouter)

export const constantRouterMap = [{
  path: '/login',
  component: (resolve) => {
    import('../view/auth/Login.vue').then(resolve)
  },
  meta: {
    skipAuth: true
  }
}, {
  path: '/',
  component: Layout,
  redirect: 'dashboard',
  // hidden: true,
  meta: { title: 'Dashboard', icon: 'dashboard', noCache: true },
  children: [
    {
      path: '/articles/:id',
      name: 'Article',
      meta: { title: 'Articles', icon: 'edit', noCache: true },
      component: (resolve) => {
        import('../view/ArticleList.vue').then(resolve)
      }
    },
    {
      path: '/journal',
      name: 'Journals',
      meta: { title: 'Journal', icon: 'list', noCache: true }
    },
    {
      path: 'dashboard',
      component: () => import('../view/dashboard/index.vue')
    }
  ]
}, /*
{ path: '',
  component: Layout,
  redirect: 'Article',
  children: [
    {
      path: '/articles/:id',
      meta: { title: 'Article', noCache: true },
      component: (resolve) => {
        import('../view/ArticleList.vue').then(resolve)
      },
      hidden: true
    }
  ]
}, */
{
  path: '*',
  component: {
    render (h) {
      return h('div', { staticClass: 'flex flex-main-center', attrs: { style: 'width:100%;font-size:32px' }}, 'Page not found')
    }
  }
}]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  componentsRouter
]
/*
export const asyncRouterMap = [
  {
    path: '/article',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    hidden: true,
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list' }
      }
    ]
  }
]*/

export function hook (userPromise) {
  // router
  router.beforeEach((to, from, next) => {
    userPromise.then(() => {
      store.dispatch('changeRouteLoading', true).then(() => {
        // has logged in, reject
        if (to.path === '/login' && store.getters.loggedIn) {
          return next(false)
        }
        if (!to.meta.skipAuth) {
          // this route requires auth, check if logged in
          // if not, redirect to login page.
          if (!store.getters.loggedIn) {
            next({
              path: '/login',
              query: { redirect: to.fullPath }
            })
          } else {
            next()
          }
        } else {
          next()
        }
      })
    })
  })

  router.afterEach(() => {
    store.dispatch('changeRouteLoading', false)
  })
}

export default router

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
},
{
  path: '/register',
  component: (resolve) => {
    import('../view/register/index.vue').then(resolve)
  },
  meta: {
    skipAuth: true
  }
},
{
  path: '/',
  component: Layout,
  redirect: 'dashboard',
  // hidden: true,
  meta: { title: 'Dashboard', icon: 'appsbutton', noCache: true },
  children: [
    {
      path: '',
      name: 'Articles',
      meta: { title: 'Articles', icon: 'edit', noCache: true },
      component: () => import('../view/dashboard/index.vue')
    },
    {
      path: '/journal',
      name: 'Journals',
      meta: { title: 'Journals', icon: 'book', noCache: true },
      component: () => import('../view/journals/index.vue')
    },
    {
      path: '/data',
      name: 'Data',
      meta: { title: 'Data', icon: 'database', noCache: true },
      component: () => import('../view/data/index.vue')
    },
    {
      path: 'settings',
      hidden: true,
      component: () => import('../view/settings/index.vue')
    },
    {
      path: 'dashboard',
      hidden: true,
      component: () => import('../view/dashboard/index.vue')
    }
  ]
},
{
  path: '/applications',
  component: Layout,
  redirect: 'applications',
  // hidden: true,
  meta: { title: 'Services', icon: 'puzzle-piece-plugin', noCache: true },
  children: [
    {
      path: 'reviewermatcher',
      name: 'Matcher',
      meta: { title: 'Reviewer Matcher', icon: 'network', noCache: true },
      component: () => import('../view/applications/reviewermatcher/index.vue')
    },
    {
      path: 'preprintsearch',
      name: 'Radar',
      meta: { title: 'Preprint Search', icon: 'search', noCache: true },
      component: () => import('../view/applications/preprintsearch/index.vue')
    },
    {
      path: 'applications',
      component: () => import('../view/applications/index.vue')
    }
  ]
},
{
  path: '',
  component: Layout,
  hidden: true,
  children: [
    {
      path: '/articles/:id',
      name: 'Article',
      meta: { title: 'Articles', icon: 'edit', noCache: true },
      component: (resolve) => {
        import('../view/article/index.vue').then(resolve)
      }
    }]
},
/*
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

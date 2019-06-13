/**
 * App router config
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Layout from '../view/layout/Layout'
// import componentsRouter from './modules/components'
// import otherModuleRoutes from './module'

Vue.use(VueRouter)

export const constantRouterMap = [{
  path: '/login',
  component: (resolve) => {
    import('../view/auth/Login.vue').then(resolve)
  },
  meta: {
    skipAuth: true
  },
  props: (route) => ({ userId: route.query.userId })
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
  path: '/auth-redirect',
  component: () => import('../view/auth/authredirect'),
  hidden: true
},
{
  path: '/invite/:id',
  component: (resolve) => {
    import('../view/invite/index.vue').then(resolve)
  },
  meta: {
    skipAuth: true
  }
},
{
  path: '/login/forgot/',
  component: (resolve) => {
    import('../view/auth/forgot.vue').then(resolve)
  },
  meta: {
    skipAuth: true
  }
},
{
  path: '/recover/password/:id',
  component: (resolve) => {
    import('../view/auth/recoverPassword.vue').then(resolve)
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
  meta: { title: 'Board', icon: 'appsbutton', noCache: true },
  children: [
    {
      path: '',
      name: 'Articles',
      meta: { title: 'My Articles', icon: 'edit', noCache: true },
      component: () => import('../view/dashboard/index.vue')
    },
    {
      path: '/journal',
      name: 'Journals',
      meta: { title: 'My Journals', icon: 'book', noCache: true },
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
},//
{
  path: '/feeds',
  component: Layout,
  redirect: 'feeds',
  // hidden: true,
  meta: { title: 'Feeds', icon: 'layers', noCache: true },
  children: [
    {
      path: 'feeds',
      hidden: true,
      component: () => import('../view/journals/index.vue')
    }
  ]
},//
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
      hidden: true,
      component: () => import('../view/applications/index.vue')
    }
  ]
},
{
  path: '/admin',
  component: Layout,
  redirect: 'admin',
  // hidden: true,
  meta: { title: 'Admin', icon: 'lock', noCache: true, roles: ['admin'] },
  children: [
    {
      path: 'user',
      name: 'Users',
      meta: { title: 'Users', icon: 'profile', noCache: true, roles: ['admin'] },
      component: () => import('../view/admin/UserList.vue')
    },
    {
      path: 'admin',
      component: () => import('../view/admin/UserList.vue')
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
      props: { newsletterPopup: false },
      meta: { title: 'Articles', icon: 'edit', noCache: true },
      component: (resolve) => {
        import('../view/article/index.vue').then(resolve)
      }
    }]
},
{
  path: '',
  component: Layout,
  hidden: true,
  children: [
    {
      path: '/journals/:id',
      name: 'Journal',
      props: { newsletterPopup: false },
      meta: { title: 'Journal', icon: 'edit', noCache: true },
      component: (resolve) => {
        import('../view/journals/index_.vue').then(resolve)
      }
    }]
},
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
  // componentsRouter,
]

function hasPermission (roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

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
            if (store.getters.roles.length === 0) {
              store.dispatch('GetUserInfo').then(res => {
                const roles = res.data.roles // note: roles must be a array! such as: ['editor','editor_journal_1','editor_journal_2']
                store.dispatch('GenerateRoutes', { roles }).then(() => {
                  router.addRoutes(store.getters.addRouters)
                  next({ ...to, replace: true })
                })
              })
            } else {
              if (hasPermission(store.getters.roles, to.meta.roles)) {
                next()
              } else {
                next({ path: '/401', replace: true, query: { noGoBack: true }})
              }
            }
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

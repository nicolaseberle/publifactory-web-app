/**
 * App router config
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Layout from '../view/layout/Layout'
import Layout_services from '../view/layout_services/Layout'

Vue.use(VueRouter)

const state_ = !!(
  process.env.DEV_LOCAL === 'true' ||
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'staging'
)
const state__ = !(
  process.env.DEV_LOCAL === 'true' ||
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'staging'
)

export const constantRouterMap = [
  {
    path: '/login',
    component: resolve => {
			import('../view/auth/Login.vue').then(resolve)
    },
    meta: {
      skipAuth: true
    },
    props: route => ({ userId: route.query.userId })
  },
  {
    path: '/register',
    component: resolve => {
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
    path: '/services/reviewermatcher',
    redirect: '/',
    hidden: true
  },
  {
    path: '',
    component: Layout_services,
    redirect: '',
    hidden: true,
    children: [
      {
        path: '/',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/applications/reviewermatcher/index_.vue').then(
					  resolve
					)
        }
      }
    ],
    meta: {
      skipAuth: true
    },
    props: route => ({ userId: route.query.userId })
  }, /*	{		path: '/services_test',		component: Layout_services,		redirect: 'services_test',
		hidden: true,
		children: [
			{
				path: '/services_test',
				meta: {
					skipAuth: true
				},
				component: resolve => {
					import('../view/applications/reviewermatcher/index_test.vue').then(
						resolve
					);
				}
			}
		],
		meta: {
			skipAuth: true
		},
		props: route => ({ userId: route.query.userId })
	},*/
  {
    path: '/front_office',
    component: Layout_services,
    redirect: 'front_office',
    hidden: true,
    children: [
      {
        path: '/front_office',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/applications/frontoffice/front_office.vue').then(
					  resolve
					)
        }
      }
    ],
    meta: {
      skipAuth: true
    },
    props: route => ({ userId: route.query.userId })
  },
  {
    path: '',
    component: Layout_services,
    hidden: true,
    children: [
      {
        path:
					'/approvals/:journalId/:userId/:requestId/:status(accepted|rejected)',
        name: 'approvals',
        meta: {
          skipAuth: false
        },
        component: resolve => {
					import('../view/approvals/').then(resolve)
        }
      }
    ]
  },
  {
    path: '',
    component: Layout_services,
    hidden: true,
    children: [
      {
        path: '/account-validation/:token',
        name: 'account-validation',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/account-validation/').then(resolve)
        }
      }
    ]
  },
  {
    path: '',
    component: Layout_services,
    hidden: true,
    children: [
      {
        path:
					'/requests/:requestId/:status(accepted|rejected|outfield|unsubscribed)',
        name: 'answer',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/request/').then(resolve)
        }
      }
    ]
  },
  {
    path: '/summarize',
    component: Layout_services,
    redirect: 'summarize',
    hidden: true,
    children: [
      {
        path: '/summarize',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/applications/summarize/index.vue').then(resolve)
        }
      }
    ],
    meta: {
      skipAuth: true
    },
    props: route => ({ userId: route.query.userId })
  },
  {
    path: '/invite/:id',
    component: resolve => {
			import('../view/invite/index.vue').then(resolve)
    },
    meta: {
      skipAuth: true
    }
  },
  {
    path: '/login/forgot/',
    component: resolve => {
			import('../view/auth/forgot.vue').then(resolve)
    },
    meta: {
      skipAuth: true
    }
  },
  {
    path: '/recover/password/:id',
    component: resolve => {
			import('../view/auth/recoverPassword.vue').then(resolve)
    },
    meta: {
      skipAuth: true
    }
  },
  {
    path: '/dashboard',
    redirect: '/dashboard/home',
    hidden: true
  },
  {
    path: '/dashboard/home',
    component: Layout,
    redirect: '/dashboard/home',
    // hidden: true,
    meta: { title: 'Dashboard', icon: 'appsbutton', noCache: true },
    children: [
      {
        path: '/article',
        hidden: state_,
        name: 'my_articles',
        meta: { title: 'my_articles', icon: 'edit', noCache: true },
        component: resolve =>
					import('../view/dashboard/index.vue').then(resolve)
      },
      {
        path: '/journal',
        hidden: state_,
        name: 'my_journals',
        meta: { title: 'my_journals', icon: 'book', noCache: true },
        component: resolve => import('../view/journals/index.vue').then(resolve)
      }, /*      {        path: '/data',        name: 'my_data',        meta: { title: 'my_data', icon: 'database', noCache: true },
        component: () => import('../view/data/index.vue')
      },*/
      {
        path: '/invitation',
        name: 'my_invitation',
        meta: { title: 'my_invitation', icon: 'guide 2', noCache: true },
        component: resolve =>
					import('../view/invitation/index.vue').then(resolve)
      },
      {
        path: '/reviewermatcher',
        name: 'reviewer_matcher',
        hidden: state__,
        meta: { title: 'reviewer_matcher', icon: 'network', noCache: true },
        component: () =>
					import('../view/applications/reviewermatcher/index_.vue')
      },
      {
        path: '/boards',
        hidden: state_,
        name: 'Journal Board',
        meta: { title: 'Journal Board', icon: 'book', noCache: true },
        component: resolve => import('../view/boards/index.vue').then(resolve)
      },
      {
        path: '/dashboard/home',
        hidden: true,
        component: resolve =>
					import('../view/invitation/index.vue').then(resolve)
      }
    ]
  }, //
  {
    path: '/feeds',
    component: Layout,
    hidden: state_,
    redirect: 'feeds',
    // hidden: true,
    meta: { title: 'feeds', icon: 'layers', noCache: true },
    children: [
      {
        path: 'feeds',
        hidden: true,
        component: () => import('../view/journals/index.vue')
      }
    ]
  }, //
  {
    path: '/applications',
    component: Layout,
    hidden: state_,
    redirect: 'applications',
    // hidden: true,
    meta: {
      title: 'services',
      icon: 'puzzle-piece-plugin',
      noCache: true,
      skipAuth: true
    },
    children: [
      {
        path: 'reviewermatcher',
        name: 'reviewer_matcher',
        meta: {
          title: 'reviewer_matcher',
          icon: 'network',
          noCache: true,
          skipAuth: true
        },
        component: () =>
					import('../view/applications/reviewermatcher/index_.vue')
      }, /*			{				path: 'summarize',				name: 'summarize_text',
				meta: {
					title: 'summarize_text',
					icon: 'network',
					noCache: true,
					skipAuth: true
				},
				component: () => import('../view/applications/summarize/index.vue')
			},*/
      {
        path: 'applications',
        component: () => import('../view/applications/index.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: 'admin/activity',
    // hidden: true,
    meta: {
      title: 'Admin',
      icon: 'lock',
      noCache: true,
      roles: ['admin']
    },
    children: [
      {
        path: 'activity',
        name: 'Activity',
        meta: {
          title: 'Activity',
          icon: 'dashboard',
          noCache: true,
          roles: ['admin']
        },
        component: () => import('../view/admin/Activity.vue')
      },
      {
        path: 'user',
        name: 'Users',
        meta: {
          title: 'Users',
          icon: 'profile',
          noCache: true,
          roles: ['admin']
        },
        component: () => import('../view/admin/UserList.vue')
      },
      {
        path: 'publisher',
        name: 'Publishers',
        meta: {
          title: 'Publishers',
          icon: 'books_1',
          noCache: true,
          roles: ['admin']
        },
        component: () => import('../view/admin/Publishers.vue')
      },
      {
        path: 'invitationReviewer',
        name: 'Invitation Reviewer',
        meta: {
          title: 'Invitation Reviewer',
          icon: 'guide 2',
          noCache: true,
          roles: ['admin']
        },
        component: () => import('../view/admin/invitationReviewer.vue')
      },
      {
        path: 'evaluation',
        name: 'Evaluation',
        meta: {
          title: 'Evaluation',
          icon: 'exam',
          noCache: true,
          roles: ['admin']
        },
        component: () => import('../view/admin/Evaluation.vue')
      }

    ]
  },
  {
    path: '/cgu_publifactory_v1',
    component: Layout_services,
    redirect: 'cgu_publifactory_v1',
    hidden: true,
    children: [
      {
        path: '/cgu_publifactory_v1',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/legal/index.vue').then(resolve)
        }
      }
    ],
    meta: {
      skipAuth: true
    }
  },
  {
    path: '/help_publifactory_v1',
    component: Layout_services,
    redirect: 'help_publifactory_v1',
    hidden: true,
    children: [
      {
        path: '/help_publifactory_v1',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/help/index.vue').then(resolve)
        }
      }
    ],
    meta: {
      skipAuth: true
    }
  },
  {
    path: '/legal',
    component: Layout_services,
    redirect: 'legal',
    hidden: true,
    children: [
      {
        path: '/legal',
        meta: {
          skipAuth: true
        },
        component: resolve => {
					import('../view/legal/index.vue').then(resolve)
        }
      },
      {
        path: '/pricing',
        meta: {
          skipAuth: true
        },
        name: 'my_pricing',
        component: resolve => {
					import('../view/billing/pricing.vue').then(resolve)
        }
      }
    ],
    meta: {
      skipAuth: true
    }
  },
  {
    path: 'settings',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/settings',
        name: 'my_settings',
        component: resolve => {
					import('../view/settings/index.vue').then(resolve)
        }
      }
    ]
  },
  {
    path: 'billing',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/billing',
        name: 'my_billing',
        component: resolve => {
					import('../view/billing/index.vue').then(resolve)
        }
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
        name: 'article',
        props: { newsletterPopup: false },
        meta: { title: 'article', icon: 'edit', noCache: true },
        component: resolve => {
					import('../view/article/index.vue').then(resolve)
        }
      }
    ]
  },
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/journals/:id',
        name: 'journal',
        props: { newsletterPopup: false },
        meta: { title: 'journal', icon: 'edit', noCache: true },
        component: resolve => {
					import('../view/journals/index_.vue').then(resolve)
        }
      }
    ]
  },
  {
    path: '*',
    component: {
      render (h) {
        return h(
          'div',
          {
            staticClass: 'flex flex-Boardmain-center',
            attrs: { style: 'width:100%;font-size:32px' }
          },
          'Page not found'
        )
      }
    }
  }
]

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
                next({
                  path: '/401',
                  replace: true,
                  query: { noGoBack: true }
                })
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

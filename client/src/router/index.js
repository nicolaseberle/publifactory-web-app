/**
 * App router config
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Layout from '../view/layout/Layout';
import Layout_services from '../view/layout_services/Layout';
// import componentsRouter from './modules/components'
// import otherModuleRoutes from './module'

Vue.use(VueRouter);

export const constantRouterMap = [
	{
		path: '/login',
		component: resolve => {
			import('../view/auth/Login.vue').then(resolve);
		},
		meta: {
			skipAuth: true
		},
		props: route => ({ userId: route.query.userId })
	},
	{
		path: '/register',
		component: resolve => {
			import('../view/register/index.vue').then(resolve);
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
					);
				}
			}
		],
		meta: {
			skipAuth: true
		},
		props: route => ({ userId: route.query.userId })
	},/*
	{
		path: '/services_test',
		component: Layout_services,
		redirect: 'services_test',
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
					);
				}
			}
		],
		meta: {
			skipAuth: true
		},
		props: route => ({ userId: route.query.userId })
	},
	{
		path:
			'/requests/:requestId/:status(accepted|rejected|outfield|unsubscribed)',
		component: resolve => {
			import('../view/request/').then(resolve);
		},
		meta: {
			skipAuth: true
		}
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
					import('../view/applications/summarize/index.vue').then(resolve);
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
			import('../view/invite/index.vue').then(resolve);
		},
		meta: {
			skipAuth: true
		}
	},
	{
		path: '/login/forgot/',
		component: resolve => {
			import('../view/auth/forgot.vue').then(resolve);
		},
		meta: {
			skipAuth: true
		}
	},
	{
		path: '/recover/password/:id',
		component: resolve => {
			import('../view/auth/recoverPassword.vue').then(resolve);
		},
		meta: {
			skipAuth: true
		}
	},
	{
		path: '/dashboard/home',
		component: Layout,
		redirect: '/dashboard/home',
		// hidden: true,
		meta: { title: 'board', icon: 'appsbutton', noCache: true },
		children: [
			{
				path: '/article',
				name: 'my_articles',
				meta: { title: 'my_articles', icon: 'edit', noCache: true },
				component: () => import('../view/dashboard/index.vue')
			},
			{
				path: '/journal',
				name: 'my_journals',
				meta: { title: 'my_journals', icon: 'book', noCache: true },
				component: () => import('../view/journals/index.vue')
			},
			{
				path: '/data',
				name: 'my_data',
				meta: { title: 'my_data', icon: 'database', noCache: true },
				component: () => import('../view/data/index.vue')
			},
			{
				path: 'settings',
				hidden: true,
				component: () => import('../view/settings/index.vue')
			},
			{
				path: '/dashboard/home',
				hidden: true,
				component: () => import('../view/dashboard/index.vue')
			}
		]
	}, //
	{
		path: '/feeds',
		component: Layout,
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
					import('../view/applications/reviewermatcher/index.vue')
			},
			{
				path: 'summarize',
				name: 'summarize_text',
				meta: {
					title: 'summarize_text',
					icon: 'network',
					noCache: true,
					skipAuth: true
				},

				component: () => import('../view/applications/summarize/index.vue')
			},
			{
				path: 'preprintsearch',
				name: 'preprint_search',
				meta: {
					title: 'preprint_search',
					icon: 'search',
					noCache: true
				},
				component: () => import('../view/applications/preprintsearch/index.vue')
			},
			{
				path: 'applications',
				component: () => import('../view/applications/index.vue')
			}
		]
	},
	{
		path: '/admin',
		component: Layout,
		redirect: 'admin',
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
					title: 'Invation Reviewer',
					icon: 'guide 2',
					noCache: true,
					roles: ['admin']
				},
				component: () => import('../view/admin/invitationReviewer.vue')
			},
			{
				path: 'admin',
				component: () => import('../view/admin/Activity.vue')
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
					import('../view/legal/index.vue').then(resolve);
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
					import('../view/help/index.vue').then(resolve);
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
					import('../view/legal/index.vue').then(resolve);
				}
			}
		],
		meta: {
			skipAuth: true
		}
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
					import('../view/article/index.vue').then(resolve);
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
					import('../view/journals/index_.vue').then(resolve);
				}
			}
		]
	},
	{
		path: '*',
		component: {
			render(h) {
				return h(
					'div',
					{
						staticClass: 'flex flex-Boardmain-center',
						attrs: { style: 'width:100%;font-size:32px' }
					},
					'Page not found'
				);
			}
		}
	}
];

const router = new VueRouter({
	mode: 'history',
	linkActiveClass: 'active',
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRouterMap
});

export const asyncRouterMap = [
	// componentsRouter,
];

function hasPermission(roles, permissionRoles) {
	if (roles.indexOf('admin') >= 0) return true; // admin permission passed directly
	if (!permissionRoles) return true;
	return roles.some(role => permissionRoles.indexOf(role) >= 0);
}

export function hook(userPromise) {
	// router
	router.beforeEach((to, from, next) => {
		userPromise.then(() => {
			store.dispatch('changeRouteLoading', true).then(() => {
				// has logged in, reject
				if (to.path === '/login' && store.getters.loggedIn) {
					return next(false);
				}
				if (!to.meta.skipAuth) {
					// this route requires auth, check if logged in
					// if not, redirect to login page.
					if (!store.getters.loggedIn) {
						next({
							path: '/login',
							query: { redirect: to.fullPath }
						});
					} else {
						if (store.getters.roles.length === 0) {
							store.dispatch('GetUserInfo').then(res => {
								const roles = res.data.roles; // note: roles must be a array! such as: ['editor','editor_journal_1','editor_journal_2']
								store.dispatch('GenerateRoutes', { roles }).then(() => {
									router.addRoutes(store.getters.addRouters);
									next({ ...to, replace: true });
								});
							});
						} else {
							if (hasPermission(store.getters.roles, to.meta.roles)) {
								next();
							} else {
								next({
									path: '/401',
									replace: true,
									query: { noGoBack: true }
								});
							}
						}
					}
				} else {
					next();
				}
			});
		});
	});

	router.afterEach(() => {
		store.dispatch('changeRouteLoading', false);
	});
}

export default router;

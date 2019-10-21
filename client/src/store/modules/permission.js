import { constantRouterMap } from '../../router'

/**
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    UPDATE_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = constantRouterMap
        } else {
          accessedRouters = filterAsyncRouter(constantRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    updateRoutes ({commit}, data) {
      return new Promise((resolve,reject)=>{
        let roles = data['roles']
        let followedJournals = data['followedJournals']
        //TO DO, inout needs to be the array of journals
        // console.log('updateRoutes :: ',roles,followedJournals)
        let  routes = filterAsyncRouter(constantRouterMap, roles)
        routes.forEach((parentRoute)=>{
          if(parentRoute.path==='/feeds'){

              parentRoute.children = [
                {
                  'path': 'feeds',
                  'hidden': 'true',
                  'component': "() => import('../view/journals/index.vue')"
                }]

              for (let i = 0; i < followedJournals.length; i++){
                let componentRoute = '../view/journals/' + followedJournals[i].id_journal._id
                let _route = {
                  'path': '/journals/' + followedJournals[i].id_journal._id,
                  'name':  followedJournals[i].id_journal.title,
                  'meta': { 'title': followedJournals[i].id_journal.title, 'icon': 'book', 'noCache': 'true' },
                }
                parentRoute.children.push(_route)
              }
              //we add a route to add other journals

              const journal = () => import('../../view/journals/index.vue')
              parentRoute.children.push(
              {
                'path': '/journal',
                'name': 'Add Journals',
                'meta': { 'title': 'Add Journals', 'icon': 'plus', 'noCache': 'true' },
                "component": journal
              })
          }
        })
        commit('UPDATE_ROUTERS', routes)
        resolve()
      })
    }
  }
}

export default permission

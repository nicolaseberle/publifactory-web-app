export default [{
  path: '/dashboard',
  component: (resolve) => {
    import('../view/Dashboard.vue').then(resolve)
  }
}, {
  path: '/users',
  component: (resolve) => {
    import('../view/UserList.vue').then(resolve)
  }
}, {
  path: '/articles/:id',
  component: (resolve) => {
    import('../view/ArticleList.vue').then(resolve)
  },
  hidden: true
}, {
  path: '/dashboard',
  component: (resolve) => {
    import('../view/dashboard/index.vue').then(resolve)
  }
}
]

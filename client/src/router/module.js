export default [ /* {
  path: '/dashboard',
  component: (resolve) => {
    import('../view/Dashboard.vue').then(resolve)
  }
}, {
  path: '/users',
  component: (resolve) => {
    import('../view/UserList.vue').then(resolve)
  }
}, */
  {
    path: '/articles/:id',
    meta: { title: 'Article', noCache: true },
    component: (resolve) => {
      import('../view/article/index.vue').then(resolve)
    },
    hidden: true
  }
]

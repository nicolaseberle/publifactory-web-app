/** When your routing table is too long, you can split it into small modules**/

import Layout from '../../view/layout/Layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noredirect',
  hidden: true,
  name: 'ComponentDemo',
  meta: {
    title: 'components',
    icon: 'component'
  },
  children: [
    {
      path: 'Article',
      component: () => import('../../view/article/index.vue'),
      name: 'Article',
      meta: { title: 'Article' }
    }
  ]
}

export default componentsRouter

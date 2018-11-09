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
      path: 'ArticleList',
      component: () => import('../../view/ArticleList.vue'),
      name: 'ArticleList',
      meta: { title: 'ArticleEdit' }
    }
  ]
}

export default componentsRouter

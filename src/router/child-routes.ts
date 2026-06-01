const importModule = import.meta.glob('../modules/**/*.vue')
const Layout = () => import('@/components/Layout/index.vue')
const LayoutView = () => import('@/components/Layout/LayoutView.vue')

const childRoutes: Array<RouteRecordRaw> = [
  {
    path: 'auth',
    component: Layout,
    name: 'Auth',
    meta: {
      title: '认证'
    },
    redirect: {
      name: 'AuthLogin'
    },
    children: [
      {
        path: 'login',
        name: 'AuthLogin',
        component: importModule['../modules/Auth/pages/index.vue'],
        meta: {
          title: '登录'
        }
      }
    ]
  },
  {
    path: 'catalog',
    component: Layout,
    name: 'Catalog',
    redirect: {
      name: 'CatalogList'
    },
    children: [
      {
        path: '',
        name: 'CatalogList',
        meta: {
          title: '资源列表'
        },
        component: importModule['../modules/Catalog/pages/index.vue']
      },
      {
        path: 'list',
        name: 'CatalogListAlias',
        component: importModule['../modules/Catalog/pages/index.vue'],
        meta: {
          title: '资源目录'
        }
      }
    ]
  },
  {
    path: 'detail',
    redirect: {
      name: 'CatalogList'
    }
  },
  {
    path: 'detail/:resourceId',
    component: LayoutView,
    name: 'Detail',
    redirect: {
      name: 'DetailOverview'
    },
    children: [
      {
        path: 'overview',
        name: 'DetailOverview',
        component: importModule['../modules/Detail/pages/index.vue'],
        meta: {
          title: '详情页'
        }
      }
    ]
  }
]

export default childRoutes

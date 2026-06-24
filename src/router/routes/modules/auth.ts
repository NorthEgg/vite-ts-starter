const authPage = () => import('@/modules/Auth/pages/index.vue')

export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'auth',
    name: 'Auth',
    meta: {
      title: '认证',
      requiresAuth: false
    },
    redirect: {
      name: 'AuthLogin'
    },
    children: [
      {
        path: 'login',
        name: 'AuthLogin',
        component: authPage,
        meta: {
          title: '登录',
          requiresAuth: false
        }
      }
    ]
  }
]

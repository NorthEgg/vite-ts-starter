import { currentLocaleMap, localesMapping } from '@/locales'
import { isUndefined } from '@/utils/type'

const layout = () => import('@/components/Layout/index.vue')
import { authRoutes } from '@/router/routes/modules/auth'
import { catalogRoutes } from '@/router/routes/modules/catalog'
import { detailRoutes } from '@/router/routes/modules/detail'

function getLocaleRegex() {
  let reg = ''

  localesMapping.forEach((localeItem, index) => {
    const line = index !== localesMapping.length - 1 ? '|' : ''
    reg = `${reg}${localeItem.localeCode}${line}`
  })

  return `(${reg})`
}

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    meta: {
      requiresAuth: false
    },
    redirect: '/catalog'
  },
  {
    path: `/:locale${getLocaleRegex()}?`,
    component: layout,
    meta: {
      requiresAuth: false
    },
    beforeEnter(to, _from, next) {
      if (
        currentLocaleMap(to.params.locale) &&
        !isUndefined(to.params.pathMatch)
      ) {
        next(`/${to.params.locale}/catalog`)
        return
      }

      next()
    },
    children: [
      {
        path: '',
        name: 'LangRoot',
        meta: {
          requiresAuth: false
        },
        redirect: {
          name: 'Catalog'
        }
      },
      ...authRoutes,
      ...catalogRoutes,
      ...detailRoutes
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/components/404.vue'),
    meta: {
      title: '404',
      requiresAuth: false
    }
  }
]

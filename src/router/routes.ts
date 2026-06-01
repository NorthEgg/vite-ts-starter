import childRoutes from '@/router/child-routes'
import { currentLocaleMap, localesMapping } from '@/locales'
import { isUndefined } from '@/utils/type'

const Layout = () => import('@/components/Layout/index.vue')

// Creates regex (zh-hans|en)
function getLocaleRegex() {
  let reg = ''
  localesMapping.forEach((localeItem, index) => {
    const line = index !== localesMapping.length - 1 ? '|' : ''
    reg = `${ reg }${ localeItem.localeCode }${ line }`
  })
  return `(${ reg })`
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    redirect: '/catalog'
  },
  {
    path: `/:locale${ getLocaleRegex() }?`,
    component: Layout,
    beforeEnter(to, _from, next) {
      if (
        currentLocaleMap(to.params.locale) &&
        !isUndefined(to.params.pathMatch)
      ) {
        next(`/${ to.params.locale }/catalog`)
        return
      }
      next()
    },
    children: [
      {
        path: '',
        name: 'LangRoot',
        redirect: {
          name: 'Catalog'
        }
      },
      ...childRoutes
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () => import('@/components/404.vue')
  }
]

export default routes

import { pinia } from '@/store'
import { useSessionStore } from '@/store/useSessionStore'
import Cookie from 'js-cookie'
import { allowlist } from '@/router/auth-list'
import { systemTitle } from '@/locales/data'

import NProgress from 'nprogress'
import type { Router } from 'vue-router'

NProgress.configure({
  showSpinner: false
})

export function createRouterGuards(router: Router) {
  const sessionStore = useSessionStore(pinia)

  router.beforeEach(async (to, _from, next) => {
    NProgress.start()

    document.title = `${ to.meta.title || '' } - ${ systemTitle }`

    const currentRouteLocale = Array.isArray(to.params.locale)
      ? to.params.locale[0]
      : to.params.locale

    if (allowlist.find((name) => to.name === name)) {
      next()
      return
    }

    if (!Cookie.get('token')) {
      next(`/${ currentRouteLocale || sessionStore.locale }/auth/login`)
      return
    }

    // 获取用户信息
    const { data, error } = await sessionStore.loadCurrentUser()

    if (error) {
      sessionStore.setLocale(
        currentRouteLocale || data.locale || sessionStore.locale
      )
      Cookie.remove('token')
      next(`/${ currentRouteLocale || sessionStore.locale }/auth/login`)
      return
    }

    // TODO: It must be used together with the backend
    sessionStore.setLocale(currentRouteLocale || data.locale)
    next()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}

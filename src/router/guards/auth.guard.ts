import Cookie from 'js-cookie';
import NProgress from 'nprogress';
import type { Router } from 'vue-router';

import { systemTitle } from '@/locales/data';
import { pinia } from '@/store';
import { useSessionStore } from '@/store/useSessionStore';

NProgress.configure({
  showSpinner: false,
});

export function setupRouterGuards(router: Router) {
  const sessionStore = useSessionStore(pinia);

  router.beforeEach(async (to, _from, next) => {
    NProgress.start();

    document.title = `${to.meta.title || ''} - ${systemTitle}`;

    const currentRouteLocale = Array.isArray(to.params.locale)
      ? to.params.locale[0]
      : to.params.locale;
    const requiresAuth = to.matched.some((record) => {
      return record.meta.requiresAuth === true;
    });

    if (!requiresAuth) {
      next();
      return;
    }

    if (!Cookie.get('token')) {
      next(`/${currentRouteLocale || sessionStore.locale}/auth/login`);
      return;
    }

    const { error } = await sessionStore.loadCurrentUser();

    if (error) {
      Cookie.remove('token');
      next(`/${currentRouteLocale || sessionStore.locale}/auth/login`);
      return;
    }

    sessionStore.setLocale(currentRouteLocale || sessionStore.locale);
    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

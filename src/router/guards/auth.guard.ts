import Cookie from 'js-cookie';
import NProgress from 'nprogress';
import type { Router } from 'vue-router';

import {
  defaultLanguageLocale,
  i18n,
  normalizeLocale,
  setI18nLanguage,
} from '@/locales';
import { pinia } from '@/store';
import { useSessionStore } from '@/store/useSessionStore';

NProgress.configure({
  showSpinner: false,
});

export function setupRouterGuards(router: Router) {
  const sessionStore = useSessionStore(pinia);

  router.beforeEach(async (to, _from, next) => {
    NProgress.start();

    const currentRouteLocale = Array.isArray(to.params.locale)
      ? to.params.locale[0]
      : to.params.locale;
    const resolvedLocale = normalizeLocale(
      currentRouteLocale || sessionStore.locale || defaultLanguageLocale,
    );
    const requiresAuth = to.matched.some((record) => {
      return record.meta.requiresAuth === true;
    });

    setI18nLanguage(resolvedLocale);

    const appTitle = i18n.global.t('base.systemTitle');
    const pageTitle =
      typeof to.meta.titleKey === 'string'
        ? i18n.global.t(to.meta.titleKey)
        : String(to.meta.title || '');

    document.title = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle;

    if (!requiresAuth) {
      next();
      return;
    }

    if (!Cookie.get('token')) {
      next(`/${resolvedLocale}/auth/login`);
      return;
    }

    const { error } = await sessionStore.loadCurrentUser();

    if (error) {
      Cookie.remove('token');
      next(`/${resolvedLocale}/auth/login`);
      return;
    }

    sessionStore.setLocale(resolvedLocale);
    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

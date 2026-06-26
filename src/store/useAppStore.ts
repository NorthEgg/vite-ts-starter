import { defineStore } from 'pinia';

import type { LangTypes } from '@/locales';

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: 'en' as LangTypes,
    user: null as null | {
      email: string;
      id: string;
      name: string;
    },
    isAuthenticated: false,
  }),
  actions: {
    setLocale(locale: LangTypes) {
      this.locale = locale;
    },
    setUser(
      user: {
        id: string;
        name: string;
        email: string;
      } | null,
    ) {
      this.user = user;
      this.isAuthenticated = Boolean(user);
    },
  },
});

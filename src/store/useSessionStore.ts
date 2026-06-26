import Cookie from 'js-cookie';
import { defineStore } from 'pinia';

import { handleApiResponse } from '@/api/core/helpers';
import { normalizeLocale } from '@/locales';
import type { LangTypes } from '@/locales';
import type {
  AuthUserModel,
  LoginPayload,
} from '@/modules/Auth/models/session';
import {
  getCurrentSession,
  loginSession,
  logoutSession,
  updateLanguagePreference,
} from '@/modules/Auth/services';

export const useSessionStore = defineStore('session', {
  state: () => ({
    locale: 'en' as LangTypes,
    currentUser: null as AuthUserModel | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
  },
  actions: {
    setLocale(locale: LangTypes) {
      this.locale = locale;
    },
    async changeLanguage(locale: LangTypes) {
      const response = await updateLanguagePreference(locale);

      await handleApiResponse(response, {
        onSuccess: (data) => {
          this.locale = normalizeLocale(data.locale);
        },
      });

      return response;
    },
    async login(payload: LoginPayload) {
      const response = await loginSession(payload);

      await handleApiResponse(response, {
        onSuccess: (data) => {
          Cookie.set('token', data.token);
          this.currentUser = data.user;
          this.locale = normalizeLocale(data.locale);
        },
        silent: true,
      });

      return response;
    },
    async logout() {
      const response = await logoutSession();

      await handleApiResponse(response, {
        onSuccess: () => {
          Cookie.remove('token');
          this.currentUser = null;
        },
        silent: true,
      });

      return response;
    },
    async loadCurrentUser() {
      const response = await getCurrentSession();

      await handleApiResponse(response, {
        onSuccess: (data) => {
          this.currentUser = data.user;
          this.locale = normalizeLocale(data.locale);
        },
        silent: true,
      });

      return response;
    },
  },
});

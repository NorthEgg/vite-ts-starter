import Cookie from 'js-cookie'
import { defineStore } from 'pinia'

import { handleApiResponse } from '@/api/core/helpers'
import type { AuthUser } from '@/api/core/types'
import {
  changeLanguagePreference,
  getCurrentUser,
  signIn,
  signOut
} from '@/modules/Auth/api'

type LoginPayload = {
  email: string
  password: string
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    locale: 'en',
    currentUser: null as AuthUser | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser)
  },
  actions: {
    setLocale(locale: string) {
      this.locale = locale
    },
    async changeLanguage(locale: string) {
      const response = await changeLanguagePreference({
        locale
      })

      await handleApiResponse(response, {
        onSuccess: () => {
          this.locale = locale
        }
      })

      return response
    },
    async login(payload: LoginPayload) {
      const response = await signIn(payload)

      await handleApiResponse(response, {
        onSuccess: (data) => {
          Cookie.set('token', data.token)
          this.currentUser = data.user
          this.locale = data.locale
        },
        silent: true
      })

      return response
    },
    async logout() {
      const response = await signOut()

      await handleApiResponse(response, {
        onSuccess: () => {
          Cookie.remove('token')
          this.currentUser = null
        },
        silent: true
      })

      return response
    },
    async loadCurrentUser() {
      const response = await getCurrentUser()

      await handleApiResponse(response, {
        onSuccess: (data) => {
          this.currentUser = data.user
          this.locale = data.locale
        },
        silent: true
      })

      return response
    }
  }
})

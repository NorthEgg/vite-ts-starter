import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    locale: 'en',
    user: null as null | {
      email: string
      id: string
      name: string
    },
    isAuthenticated: false
  }),
  actions: {
    setLocale(locale: string) {
      this.locale = locale
    },
    setUser(
      user: {
        id: string
        name: string
        email: string
      } | null
    ) {
      this.user = user
      this.isAuthenticated = Boolean(user)
    }
  }
})

import { currentLocaleMap } from '@/locales'
import { useSessionStore } from '@/composables/useBaseStore'

export const useLanguage = () => {
  const sessionStore = useSessionStore()

  const currentLocaleLang = computed(() => {
    let locale: any = null

    const targetLocaleItem = currentLocaleMap(sessionStore.locale)

    if (targetLocaleItem) {
      locale = targetLocaleItem.localeLang
    }

    return locale
  })

  return {
    currentLocaleLang
  }
}

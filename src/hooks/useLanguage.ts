import { currentLocaleMap } from '@/locales'
import { useSessionStore } from '@/hooks/useBaseStore'

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

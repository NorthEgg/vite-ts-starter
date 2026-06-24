import { useSessionStore } from '@/composables/useBaseStore';
import { currentLocaleMap } from '@/locales';

export const useLanguage = () => {
  const sessionStore = useSessionStore();

  const currentLocaleLang = computed(() => {
    let locale: any = null;

    const targetLocaleItem = currentLocaleMap(sessionStore.locale);

    if (targetLocaleItem) {
      locale = targetLocaleItem.localeLang;
    }

    return locale;
  });

  return {
    currentLocaleLang,
  };
};

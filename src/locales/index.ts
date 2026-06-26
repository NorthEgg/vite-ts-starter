import enElement from 'element-plus/es/locale/lang/en';
import zhCnElement from 'element-plus/es/locale/lang/zh-cn';
import { createI18n } from 'vue-i18n';

import en from '@/locales/lang/en.json';
import zhHans from '@/locales/lang/zh-hans.json';

export const localeMessages = {
  en,
  'zh-hans': zhHans,
} as const;

export type LangTypes = keyof typeof localeMessages;

export const defaultLanguageLocale: LangTypes = 'en';

export const localesMapping = [
  {
    localeCode: 'zh-hans',
    localeName: '简体中文',
    elementLocale: zhCnElement,
  },
  {
    localeCode: 'en',
    localeName: 'English',
    elementLocale: enElement,
  },
] as const;

export const currentLocaleMap = (
  targetLocaleCode: string | string[] | undefined,
) => {
  const localeCode = Array.isArray(targetLocaleCode)
    ? targetLocaleCode[0]
    : targetLocaleCode;

  return localesMapping.find((localeItem) => {
    return localeItem.localeCode === localeCode;
  });
};

export function normalizeLocale(
  targetLocaleCode: string | string[] | undefined,
): LangTypes {
  return (
    currentLocaleMap(targetLocaleCode)?.localeCode ?? defaultLanguageLocale
  );
}

export function getElementLocale(
  targetLocaleCode: string | string[] | undefined,
) {
  return currentLocaleMap(targetLocaleCode)?.elementLocale ?? enElement;
}

export const i18n = createI18n({
  legacy: false,
  locale: defaultLanguageLocale,
  fallbackLocale: defaultLanguageLocale,
  globalInjection: true,
  messages: localeMessages,
});

export function setI18nLanguage(targetLocaleCode: LangTypes) {
  i18n.global.locale.value = targetLocaleCode;
  document.documentElement.lang = targetLocaleCode;
}

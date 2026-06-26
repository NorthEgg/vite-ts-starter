<script lang="ts" setup>
import { useSessionStore } from '@/composables/useBaseStore';
import {
  defaultLanguageLocale,
  getElementLocale,
  normalizeLocale,
  setI18nLanguage,
} from '@/locales';

const sessionStore = useSessionStore();
const route = useRoute();
const currentElementLocale = computed(() => {
  return getElementLocale(sessionStore.locale);
});

watch(
  () => [route.name, route.params.locale, sessionStore.locale] as const,
  ([routeName, routeLocale, storeLocale]) => {
    if (routeName === '404') return;

    const nextLocale = normalizeLocale(
      routeLocale || storeLocale || defaultLanguageLocale,
    );

    if (sessionStore.locale !== nextLocale) {
      sessionStore.setLocale(nextLocale);
    }

    setI18nLanguage(nextLocale);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <ElConfigProvider :locale="currentElementLocale">
    <RouterView />
  </ElConfigProvider>
</template>

<style lang="scss">
@use '@/styles/index';
</style>

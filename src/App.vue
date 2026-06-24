<script lang="ts" setup>
import { useSessionStore } from '@/composables/useBaseStore';
import { useLanguage } from '@/composables/useLanguage';
import { defaultLanguageLocale } from '@/locales';

const sessionStore = useSessionStore();
const route = useRoute();

const { currentLocaleLang } = useLanguage();

watch(
  () => route.params,
  () => {
    if (route.name === '404') return;

    sessionStore.setLocale(
      String(route.params.locale || defaultLanguageLocale),
    );
  },
);
</script>

<template>
  <ElConfigProvider :locale="currentLocaleLang">
    <router-view />
  </ElConfigProvider>
</template>

<style lang="scss">
@use '@/styles/index';
</style>

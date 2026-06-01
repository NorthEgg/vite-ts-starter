<script lang="ts" setup>
import { defaultLanguageLocale } from '@/locales'
import { useSessionStore } from '@/hooks/useBaseStore'

const sessionStore = useSessionStore()
const route = useRoute()

const { currentLocaleLang } = useLanguage()

watch(
  () => route.params,
  () => {
    if (route.name === '404') return

    sessionStore.setLocale(String(route.params.locale || defaultLanguageLocale))
  }
)
</script>

<template>
  <ElConfigProvider :locale="currentLocaleLang">
    <router-view />
  </ElConfigProvider>
</template>

<style lang="scss">
@use '@/styles/index';
</style>

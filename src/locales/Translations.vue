<script lang="ts">
import { localesMapping } from '@/locales'

import LogoIcon from '@/locales/LogoIcon.vue'
import { useSessionStore } from '@/hooks/useBaseStore'

export default defineComponent({
  name: 'TranslationsBox',
  components: {
    LogoIcon
  },
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const sessionStore = useSessionStore()
    const localesList = ref(localesMapping)
    const currentLocale = computed(() => sessionStore.locale)

    const handleChange = (targetLocaleItem) => {
      setTimeout(() => {
        const { localeCode } = targetLocaleItem
        router.replace({
          params: {
            ...route.params,
            locale: localeCode
          }
        })
        sessionStore.setLocale(localeCode)
      })
    }
    return {
      localesList,
      currentLocale,
      handleChange
    }
  }
})
</script>

<template>
  <el-dropdown
    class="translations-box"
    popper-class="translations-box"
    :class="{
      'is-dark': dark
    }"
    trigger="hover"
    @command="handleChange"
  >
    <span class="icon-outer">
      <!-- Translations<el-icon class="el-icon--right">
        <ArrowDown />
      </el-icon> -->
      <LogoIcon :dark="dark" />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(localeItem, index) in localesList"
          :key="index"
          :command="localeItem"
          :disabled="currentLocale === localeItem.localeCode"
        >
          <span class="custom-dropdown-item">
            {{ localeItem.localeName }}
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss">
.translations-box {
  display: flex;
  align-items: center;
  color: #fff;
  outline: none;
  cursor: initial;
  user-select: none;

  &.is-dark {
    color: #495164;
  }

  .icon-outer {
    display: flex;
    align-items: center;
    outline: none;

    &:hover > * {
      color: $color-primary;
    }
  }

  .custom-dropdown-item {
    white-space: nowrap;
  }
}
</style>

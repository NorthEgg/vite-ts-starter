<script lang="ts">
import { useSessionStore } from '@/composables/useBaseStore';
import type { LangTypes } from '@/locales';
import { localesMapping } from '@/locales';
import LogoIcon from '@/locales/LogoIcon.vue';

export default defineComponent({
  name: 'TranslationsBox',
  components: {
    LogoIcon,
  },
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const sessionStore = useSessionStore();
    const localesList = ref(localesMapping);
    const currentLocale = computed(() => sessionStore.locale);

    const handleChange = async (targetLocaleItem: {
      localeCode: LangTypes;
    }) => {
      const previousLocale = currentLocale.value;
      const { localeCode } = targetLocaleItem;

      sessionStore.setLocale(localeCode);

      if (sessionStore.isAuthenticated) {
        const { error } = await sessionStore.changeLanguage(localeCode);

        if (error) {
          sessionStore.setLocale(previousLocale);
          return;
        }
      }

      await router.replace({
        params: {
          ...route.params,
          locale: localeCode,
        },
      });
    };

    return {
      localesList,
      currentLocale,
      handleChange,
    };
  },
});
</script>

<template>
  <ElDropdown
    class="translations-box"
    popper-class="translations-box"
    :class="{
      'is-dark': dark,
    }"
    trigger="hover"
    @command="handleChange"
  >
    <span class="icon-outer">
      <!-- Translations<ElIcon class="el-icon--right">
        <ArrowDown />
      </ElIcon> -->
      <LogoIcon :dark="dark" />
    </span>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="(localeItem, index) in localesList"
          :key="index"
          :command="localeItem"
          :disabled="currentLocale === localeItem.localeCode"
        >
          <span class="custom-dropdown-item">
            {{ localeItem.localeName }}
          </span>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
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

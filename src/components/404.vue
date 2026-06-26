<script lang="ts">
import { i18n } from '@/locales';

export default defineComponent({
  name: 'NotFound',
  setup() {
    const notFoundText = computed(() => i18n.global.t('base.notFound'));

    return {
      notFoundText,
    };
  },
});
</script>

<template>
  <div class="not-found-page">
    <h1>404</h1>
    <p>{{ notFoundText }}</p>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  display: grid;
  min-height: 100vh;
  place-content: center;
  text-align: center;
  gap: 8px;
  color: #303133;

  h1,
  p {
    margin: 0;
  }

  h1 {
    font-size: 56px;
    line-height: 1;
  }

  p {
    color: #606266;
  }
}
</style>

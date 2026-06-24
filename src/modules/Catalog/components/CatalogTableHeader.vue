<script lang="ts">
import { useLocale } from 'element-plus';

export default defineComponent({
  name: 'CatalogTableHeader',
  setup() {
    const localeInject = useLocale();
    const list = computed(() => [
      {
        name: localeInject.t('catalog.name'),
      },
      {
        name: localeInject.t('catalog.updatedAt'),
        width: '18%',
      },
      {
        name: localeInject.t('catalog.state'),
        width: '19%',
      },
    ]);

    function getHeadItem(head) {
      return {
        width: head.width,
        flex: head.width ? 'initial' : 1,
      };
    }
    return {
      localeInject,

      list,

      getHeadItem,
    };
  },
});
</script>

<template>
  <ul class="catalog-table-header-container">
    <li
      v-for="(headItem, index) in list"
      :key="index"
      :style="getHeadItem(headItem)"
      class="catalog-table-header-container__head-item"
    >
      {{ headItem.name }}
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.catalog-table-header-container {
  display: flex;
  padding: 10px 24px;
  font-weight: 400;
  line-height: 20px;
  color: #909399;

  .catalog-table-header-container__head-item {
  }
}
</style>

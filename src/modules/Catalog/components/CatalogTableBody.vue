<script lang="ts">
import CatalogItem from '@/modules/Catalog/components/CatalogItem.vue'
import { storeToRefs } from 'pinia'
import { useCatalogStore } from '@/hooks/useBaseStore'

export default defineComponent({
  name: 'CatalogTableBody',
  components: {
    CatalogItem
  },
  setup() {
    const catalogStore = useCatalogStore()
    const { items: resourceList } = storeToRefs(catalogStore)
    return {
      resourceList
    }
  }
})
</script>

<template>
  <div class="catalog-table-body-container">
    <div class="catalog-table-body-container__inner">
      <CatalogItem
        v-for="(resourceItem, index) in resourceList"
        :key="index"
        :dataset="resourceItem"
      />
      <div v-if="!resourceList.length" class="catalog-empty-box">
        <img src="@/assets/images/catalog-empty.svg" alt="Empty">
        <span>{{ _t('base.empty') }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.catalog-table-body-container {
  position: relative;
  flex: auto;

  .catalog-table-body-container__inner {
    position: absolute;
    inset: 0;
    overflow: hidden scroll;
    padding: 10px 6px 0;
    scroll-behavior: smooth;

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    .catalog-empty-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding-top: 171px;

      & > img {
        width: 140px;
      }

      & > span {
        font-size: 14px;
        line-height: 14px;
        color: #606266;
      }
    }
  }
}
</style>

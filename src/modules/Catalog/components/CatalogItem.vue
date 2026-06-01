<script lang="ts" setup>
import { Loading } from '@element-plus/icons-vue'

import { sleep } from '@/utils/request'
import { ElMessage, useLocale } from 'element-plus'
import { useCatalogStore } from '@/hooks/useBaseStore'

defineOptions({
  name: 'CatalogItem'
})

const props = defineProps({
  dataset: {
    type: Object as PropType<import('@/store/useCatalogStore').ResourceSummary>,
    default() {
      return {
        id: '',
        title: '',
        subtitle: '',
        description: '',
        status: 'draft',
        updatedAt: ''
      }
    }
  }
})

const localeInject = useLocale()
const catalogStore = useCatalogStore()
const isLoading = ref(false)
const getActionIcon = computed(() => {
  return props.dataset.status === 'active' ? 'iconstop' : 'iconplay'
})

async function handleToggleStatus() {
  if (isLoading.value) return

  isLoading.value = true

  await sleep(300)
  await catalogStore.toggleItemStatus(props.dataset.id)

  isLoading.value = false

  if (props.dataset.status === 'active') {
    ElMessage.info(localeInject.t('catalog.deactivated'))
  } else {
    ElMessage.success(localeInject.t('catalog.activated'))
  }
}
</script>

<template>
  <router-link
    :to="`${$route.params.locale ? '/' + $route.params.locale + '/' : '/'}detail/${dataset.id}/overview`"
  >
    <ul class="catalog-item-container">
      <li style="flex: 1; min-width: 0">
        <div class="catalog-item__name">
          <div class="catalog-item__name-left">
            <IconFont icon="iconfile" />
          </div>
          <div class="catalog-item__name-desc">
            <div class="catalog-item__name-desc__subtitle">
              <span
                class="catalog-item__name-desc__subtitle-maintext text_nowrap"
                >{{ dataset.subtitle }}</span
              >
              <span @click.prevent>
                <TooltipCustom
                  v-if="dataset.description"
                  :content="dataset.description"
                >
                  <IconFont icon="iconhelp" class="subtitle-notes" />
                </TooltipCustom>
              </span>
            </div>
            <p class="catalog-item__name-desc__title text_nowrap">
              {{ dataset.title }}
            </p>
          </div>
        </div>
      </li>

      <li style="width: 18.5%; flex: initial" class="text_nowrap">
        {{ dataset.updatedAt }}
      </li>
      <li
        class="catalog-item-action text_nowrap"
        :class="{
          active: dataset.status === 'active',
          loading: isLoading
        }"
        @click.prevent="handleToggleStatus()"
      >
        <span class="catalog-item-action__icon">
          <IconFont v-if="!isLoading" :icon="getActionIcon" />
          <Loading v-else class="transform-rotate360" />
        </span>
        <span class="catalog-item-action__status">
          {{
            dataset.status === 'active'
              ? _t('catalog.stop')
              : _t('catalog.publish')
          }}
        </span>
      </li>
    </ul>
  </router-link>
</template>

<style lang="scss" scoped>
.catalog-item-container {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  box-shadow: 0 1px 4px 0 rgba(#000, 0.08);
  border-radius: 8px;
  background: #fff;
  margin-bottom: 16px;
  transition:
    background 0.3s,
    border 0.3s,
    box-shadow 0.3s;
  color: #303133;
  user-select: none;
  border: 1px solid transparent;

  &:hover {
    box-shadow: 0 10px 30px -20px rgba(#000, 0.24);
    border: 1px solid #dcdfe6;
  }

  .catalog-item__name {
    display: flex;
    align-items: center;
    min-width: 0;

    .catalog-item__name-left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 5px;
      background-color: #ecf3ff;
      margin-right: 16px;

      & > svg {
        width: 20px;
        font-size: 20px;
        color: $color-primary;
      }
    }

    .catalog-item__name-desc {
      --at-apply: flex-1 overflow-hidden;

      .catalog-item__name-desc__subtitle {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #303133;

        .catalog-item__name-desc__subtitle-maintext {
          max-width: 80%;
          margin-right: 10px;
        }

        .subtitle-notes {
          font-size: 15px;
          color: $color-info;
          cursor: pointer;
        }
      }

      .catalog-item__name-desc__title {
        font-size: 12px;
        color: $color-info;
      }
    }
  }

  .catalog-item-action {
    flex: initial;
    display: flex;
    align-items: center;
    width: 19%;
    height: 100%;
    font-size: 14px;
    transition: 0.3s;
    cursor: pointer;

    .catalog-item-action__icon {
      width: 20px;

      & > svg {
        width: 100%;
        font-size: 20px;
      }
    }

    .catalog-item-action__status {
      padding-left: 6px;
    }

    &.active {
      color: $color-primary;
    }

    &.loading {
      color: $color-primary;
    }

    &:hover {
      color: #6b9eff;
    }
  }
}
</style>

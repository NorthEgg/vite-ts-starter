<script lang="ts">
import { useI18n } from 'vue-i18n';

import NavigationNavBar from '@/components/Navigation/NavBar.vue';
import NavigationSideLogo from '@/components/Navigation/Side/SideLogo.vue';
import { useCatalogStore } from '@/composables/useBaseStore';
import CatalogTableBody from '@/modules/Catalog/components/CatalogTableBody.vue';
import CatalogTableHeader from '@/modules/Catalog/components/CatalogTableHeader.vue';
import ResourceForm from '@/modules/Catalog/components/ResourceForm.vue';
import { useCatalogList } from '@/modules/Catalog/composables/useCatalogList';

export default defineComponent({
  name: 'CatalogListPage',
  components: {
    NavigationNavBar,
    NavigationSideLogo,
    CatalogTableHeader,
    CatalogTableBody,
  },
  // https://github.com/vuejs/vue-next/issues/3649
  setup() {
    const { proxy } = useCurrentInstance();
    const catalogStore = useCatalogStore();
    const { t } = useI18n();
    const {
      handleCreateResource,
      handleSelectSearch,
      loadingContent,
      testI18nDate,
    } = useCatalogList({
      catalogStore,
      openDialog: proxy.$ModalDialog,
      resourceFormComponent: ResourceForm,
    });

    return {
      t,
      loadingContent,
      testI18nDate,

      handleCreateResource,
      handleSelectSearch,
    };
  },
});
</script>

<template>
  <LayoutArea>
    <template #top>
      <NavigationNavBar :fixed="false">
        <NavigationSideLogo />
      </NavigationNavBar>
    </template>

    <template #side>
      <LayoutSection :title="t('catalog.manageTitle')">
        <el-button
          type="primary"
          class="create-action"
          @click="handleCreateResource()"
        >
          <IconFont icon="iconestablish" class="mr-2" />
          {{ $t('catalog.create') }}
        </el-button>
      </LayoutSection>
    </template>

    <template #content>
      <LayoutSection has-divider flex-content :loading="loadingContent">
        <template #head>
          <el-date-picker
            v-model="testI18nDate"
            :start-placeholder="$t('base.rangeStart')"
            :end-placeholder="$t('base.rangeEnd')"
            type="datetimerange"
          />
        </template>

        <CatalogTableHeader />
        <CatalogTableBody />
      </LayoutSection>
    </template>
  </LayoutArea>
</template>

<style lang="scss" scoped>
.create-action {
  padding: 10px 20px;
  width: 100%;
  font-weight: 600;
}
</style>

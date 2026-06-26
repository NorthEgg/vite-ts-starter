<script lang="ts">
import NavigationNavBar from '@/components/Navigation/NavBar.vue';
import NavigationSideGoBack from '@/components/Navigation/Side/SideGoBack.vue';

export default defineComponent({
  name: 'LayoutView',
  components: {
    NavigationNavBar,
    NavigationSideGoBack,
  },
});
</script>

<template>
  <LayoutArea>
    <template #top>
      <NavigationNavBar :fixed="false">
        <NavigationSideGoBack :title="$t('base.goback')" />
      </NavigationNavBar>
    </template>
    <template #side>
      <LayoutSection has-divider :title="$t('detail.title')">
        <p class="layout-view__placeholder">
          {{ $t('detail.sidePlaceholder') }}
        </p>
      </LayoutSection>
    </template>
    <template #content>
      <router-view />
    </template>
  </LayoutArea>
</template>

<style lang="scss" scoped>
.layout-view__placeholder {
  margin: 0;
  line-height: 1.6;
  color: #606266;
}
</style>

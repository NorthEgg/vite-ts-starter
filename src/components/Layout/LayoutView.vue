<script lang="ts">
import NavigationSideGoBack from '@/components/Navigation/Side/SideGoBack.vue'
import NavigationNavBar from '@/components/Navigation/NavBar.vue'

export default defineComponent({
  name: 'LayoutView',
  components: {
    NavigationNavBar,
    NavigationSideGoBack
  }
})
</script>

<template>
  <LayoutArea>
    <template #top>
      <NavigationNavBar :fixed="false">
        <NavigationSideGoBack :title="_t('base.goback')" />
      </NavigationNavBar>
    </template>
    <template #side>
      <LayoutSection has-divider :title="_t('detail.title')">
        <p class="layout-view__placeholder">
          Replace this side panel with module-specific navigation, filters, or
          auxiliary content.
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

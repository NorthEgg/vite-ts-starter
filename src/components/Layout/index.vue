<script lang="ts">
export default defineComponent({
  name: 'AppMain',
});
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Component :is="Component" />
  </RouterView>
</template>

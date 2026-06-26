<script lang="ts">
export default defineComponent({
  name: 'NavigationSideAction',
  emits: ['click'],
  setup() {
    const { proxy } = useCurrentInstance();

    function handleClick() {
      proxy.$emit('click');
    }

    return {
      handleClick,
    };
  },
});
</script>

<template>
  <div class="side-action-container">
    <ul class="action-list">
      <li v-for="item in 3" :key="item" class="action-item">
        {{ $t('nav.action') }} {{ item }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.side-action-container {
  position: relative;

  .action-list {
    display: flex;
    white-space: nowrap;

    .action-item {
      height: 100%;
      line-height: inherit;
      background-color: #eee;
      padding: 0 12px;
      margin-right: 5px;

      &:last-child {
        // margin-right: 0;
      }
    }
  }
}
</style>

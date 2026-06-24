<script lang="ts">
import { useDetailStore } from '@/composables/useBaseStore';
import { useDetailOverview } from '@/modules/Detail/composables/useDetailOverview';

export default defineComponent({
  name: 'DetailOverviewPage',
  setup() {
    const detailStore = useDetailStore();
    const { overviewData } = useDetailOverview(detailStore);

    return {
      overviewData,
    };
  },
});
</script>

<template>
  <LayoutSection flex-content :title="overviewData.title">
    <div class="detail-panel">
      <p class="detail-panel__summary">
        {{ overviewData.summary }}
      </p>
      <div class="detail-panel__grid">
        <article
          v-for="section in overviewData.sections"
          :key="section.id"
          class="detail-panel__card"
        >
          <h3>{{ section.title }}</h3>
          <p>{{ section.description }}</p>
        </article>
      </div>
    </div>
  </LayoutSection>
</template>

<style lang="scss" scoped>
.detail-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
}

.detail-panel__summary {
  margin: 0;
  color: #606266;
  line-height: 1.7;
}

.detail-panel__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.detail-panel__card {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  background: #fff;

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    color: #303133;
  }

  p {
    margin: 0;
    line-height: 1.6;
    color: #606266;
  }
}
</style>

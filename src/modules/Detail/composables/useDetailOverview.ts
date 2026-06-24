import { storeToRefs } from 'pinia'

import type useDetailStore from '@/modules/Detail/store'

type DetailStore = ReturnType<typeof useDetailStore>

export function useDetailOverview(detailStore: DetailStore) {
  const route = useRoute()
  const { panel: overviewData } = storeToRefs(detailStore)
  const currentResourceId = computed(() =>
    String(route.params.resourceId || 'resource-001')
  )

  async function load() {
    const { error } = await detailStore.loadDetail(currentResourceId.value)
    void error
  }

  onMounted(() => {
    void load()
  })

  return {
    overviewData
  }
}

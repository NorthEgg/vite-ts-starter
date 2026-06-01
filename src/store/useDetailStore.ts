import { defineStore } from 'pinia'

import { handleApiResponse } from '@/api/core/helpers'
import { getDetailPanel } from '@/modules/Detail/api'

export interface DetailPanel {
  title: string
  summary: string
  sections: Array<{
    id: string
    title: string
    description: string
  }>
}

export const useDetailStore = defineStore('detail', {
  state: () => ({
    panel: {
      title: '',
      summary: '',
      sections: []
    } as DetailPanel
  }),
  actions: {
    async loadDetail(resourceId: string) {
      const response = await getDetailPanel(resourceId)

      await handleApiResponse(response, {
        onSuccess: (data) => {
          this.panel = data
        }
      })

      return response
    }
  }
})

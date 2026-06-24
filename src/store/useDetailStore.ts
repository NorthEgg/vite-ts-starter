import { defineStore } from 'pinia'

import { handleApiResponse } from '@/api/core/helpers'
import { getDetailOverview } from '@/modules/Detail/services'
import type { DetailPanelModel } from '@/modules/Detail/models/detail'

export const useDetailStore = defineStore('detail', {
  state: () => ({
    panel: {
      title: '',
      summary: '',
      sections: []
    } as DetailPanelModel
  }),
  actions: {
    async loadDetail(resourceId: string) {
      const response = await getDetailOverview(resourceId)

      await handleApiResponse(response, {
        onSuccess: (data) => {
          this.panel = data
        }
      })

      return response
    }
  }
})

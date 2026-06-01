import { defineStore } from 'pinia'

import { handleApiResponse } from '@/api/core/helpers'
import type { ApiResponse, ListResult } from '@/api/core/types'
import { getResourceList, toggleResourceStatus } from '@/modules/Catalog/api'

export interface ResourceSummary {
  id: string
  title: string
  subtitle: string
  description: string
  status: 'draft' | 'active'
  updatedAt: string
}

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    items: [] as ResourceSummary[],
    selectedId: null as string | null
  }),
  actions: {
    async loadItems(keyword?: string) {
      const response = await getResourceList({
        keyword
      })

      await handleApiResponse(response, {
        onSuccess: (data) => {
          this.items = data.items
        }
      })

      return response
    },
    async toggleItemStatus(id: string) {
      const response = await toggleResourceStatus({
        id
      })

      await handleApiResponse(response, {
        onSuccess: () => {
          const target = this.items.find((item) => item.id === id)

          if (target) {
            target.status = target.status === 'active' ? 'draft' : 'active'
          }
        }
      })

      return response
    },
    seedItems(items: ResourceSummary[]) {
      this.items = items
    },
    async createItem(payload: {
      title: string
      subtitle: string
      description: string
    }) {
      const createdItem: ResourceSummary = {
        id: `resource-${ Date.now() }`,
        title: payload.title,
        subtitle: payload.subtitle,
        description: payload.description,
        status: 'draft',
        updatedAt: new Date().toISOString().slice(0, 10)
      }

      this.items = [createdItem, ...this.items]

      return {
        data: createdItem,
        error: null,
        message: 'Created successfully',
        success: true
      }
    }
  }
})

export type CatalogListResponse = ApiResponse<ListResult<ResourceSummary>>

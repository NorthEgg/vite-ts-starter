import { defineStore } from 'pinia';

import { handleApiResponse } from '@/api/core/helpers';
import type { ApiResponse } from '@/api/core/types';
import type {
  CreateResourcePayload,
  ResourceListResult,
  ResourceSummary,
} from '@/modules/Catalog/models/resource';
import {
  createCatalogResource,
  getCatalogList,
  updateCatalogResourceStatus,
} from '@/modules/Catalog/services';

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    items: [] as ResourceSummary[],
    selectedId: null as string | null,
  }),
  actions: {
    async loadItems(keyword?: string) {
      const response = await getCatalogList({
        keyword,
      });

      await handleApiResponse(response, {
        onSuccess: (data) => {
          this.items = data.items;
        },
      });

      return response;
    },
    async toggleItemStatus(id: string) {
      const response = await updateCatalogResourceStatus({
        id,
      });

      await handleApiResponse(response, {
        onSuccess: (data) => {
          const target = this.items.find((item) => item.id === id);

          if (target) {
            target.status = data.status;
          }
        },
      });

      return response;
    },
    seedItems(items: ResourceSummary[]) {
      this.items = items;
    },
    async createItem(payload: CreateResourcePayload) {
      const response = await createCatalogResource(payload);

      await handleApiResponse(response, {
        onSuccess: (createdItem) => {
          this.items = [createdItem, ...this.items];
        },
      });

      return response;
    },
  },
});

export type CatalogListResponse = ApiResponse<ResourceListResult>;

import { mapApiResponse } from '@/api/core/helpers'
import type { ApiResponse, ListQuery } from '@/api/core/types'
import {
  createResource,
  getResourceList,
  toggleResourceStatus
} from '@/modules/Catalog/api'
import {
  toCreateResourcePayloadDTO,
  toResourceListResult,
  toResourceSummary,
  toToggleResourceStatusResult
} from '@/modules/Catalog/mappers/resource'
import type {
  CreateResourcePayload,
  ResourceListResult,
  ResourceSummary,
  ToggleResourceStatusResult
} from '@/modules/Catalog/models/resource'

export async function getCatalogList(
  query: ListQuery = {}
): Promise<ApiResponse<ResourceListResult>> {
  const response = await getResourceList(query)
  return mapApiResponse(response, toResourceListResult)
}

export async function createCatalogResource(
  payload: CreateResourcePayload
): Promise<ApiResponse<ResourceSummary>> {
  const response = await createResource(toCreateResourcePayloadDTO(payload))
  return mapApiResponse(response, toResourceSummary)
}

export async function updateCatalogResourceStatus(payload: {
  id: string
}): Promise<ApiResponse<ToggleResourceStatusResult>> {
  const response = await toggleResourceStatus(payload)
  return mapApiResponse(response, toToggleResourceStatusResult)
}

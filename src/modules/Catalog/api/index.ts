import { createSuccessResponse } from '@/api/core/helpers'
import type { ApiResponse, ListQuery } from '@/api/core/types'
import type {
  CreateResourcePayloadDTO,
  ResourceListResultDTO,
  ResourceSummaryDTO,
  ToggleResourceStatusResultDTO
} from '@/modules/Catalog/mappers/resource'

let resourceListSeed: ResourceSummaryDTO[] = [
  {
    resource_id: 'resource-001',
    resource_title: 'Operations Overview',
    resource_subtitle: 'Starter resource card',
    resource_description:
      'Use this area to describe the primary object in your system.',
    resource_status: 'active',
    updated_at: '2026-05-29'
  },
  {
    resource_id: 'resource-002',
    resource_title: 'Quality Dashboard',
    resource_subtitle: 'Secondary example item',
    resource_description:
      'Replace this seeded content with your own domain entities.',
    resource_status: 'draft',
    updated_at: '2026-05-28'
  }
]

export async function getResourceList(
  query: ListQuery = {}
): Promise<ApiResponse<ResourceListResultDTO>> {
  const keyword = query.keyword?.trim().toLowerCase()
  const items = keyword
    ? resourceListSeed.filter((item) => {
        return [
          item.resource_title,
          item.resource_subtitle,
          item.resource_description
        ]
          .join(' ')
          .toLowerCase()
          .includes(keyword)
      })
    : resourceListSeed

  return createSuccessResponse({
    items,
    next_cursor: null,
    total: items.length
  } satisfies ResourceListResultDTO)
}

export async function toggleResourceStatus(payload: {
  id: string
}): Promise<ApiResponse<ToggleResourceStatusResultDTO>> {
  const target = resourceListSeed.find(
    (item) => item.resource_id === payload.id
  )
  const nextStatus = target?.resource_status === 'active' ? 'draft' : 'active'

  if (target) {
    target.resource_status = nextStatus
  }

  return createSuccessResponse({
    resource_id: payload.id,
    resource_status: nextStatus || 'draft'
  })
}

export async function createResource(
  payload: CreateResourcePayloadDTO
): Promise<ApiResponse<ResourceSummaryDTO>> {
  const createdItem: ResourceSummaryDTO = {
    resource_id: `resource-${Date.now()}`,
    resource_title: payload.resource_title,
    resource_subtitle: payload.resource_subtitle,
    resource_description: payload.resource_description,
    resource_status: 'draft',
    updated_at: new Date().toISOString().slice(0, 10)
  }

  resourceListSeed = [createdItem, ...resourceListSeed]

  return createSuccessResponse(createdItem)
}

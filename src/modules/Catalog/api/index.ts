import { createSuccessResponse } from '@/api/core/helpers'
import type { ApiResponse, ListQuery, ListResult } from '@/api/core/types'
import type { ResourceSummary } from '@/store/useCatalogStore'

const resourceListSeed: ResourceSummary[] = [
  {
    id: 'resource-001',
    title: 'Operations Overview',
    subtitle: 'Starter resource card',
    description: 'Use this area to describe the primary object in your system.',
    status: 'active',
    updatedAt: '2026-05-29'
  },
  {
    id: 'resource-002',
    title: 'Quality Dashboard',
    subtitle: 'Secondary example item',
    description: 'Replace this seeded content with your own domain entities.',
    status: 'draft',
    updatedAt: '2026-05-28'
  }
]

export async function getResourceList(
  query: ListQuery = {}
): Promise<ApiResponse<ListResult<ResourceSummary>>> {
  const keyword = query.keyword?.trim().toLowerCase()
  const items = keyword
    ? resourceListSeed.filter((item) => {
      return [item.title, item.subtitle, item.description]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    })
    : resourceListSeed

  return createSuccessResponse({
    items,
    nextCursor: null,
    total: items.length
  })
}

export async function toggleResourceStatus(payload: {
  id: string
}): Promise<ApiResponse<{ id: string; }>> {
  return createSuccessResponse({
    id: payload.id
  })
}

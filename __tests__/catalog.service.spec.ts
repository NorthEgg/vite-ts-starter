import { beforeEach, describe, expect, it, vi } from 'vitest'

const catalogApiMocks = vi.hoisted(() => {
  return {
    createResource: vi.fn(),
    getResourceList: vi.fn(),
    toggleResourceStatus: vi.fn()
  }
})

vi.mock('@/modules/Catalog/api', () => catalogApiMocks)

import { createSuccessResponse } from '@/api/core/helpers'
import {
  createCatalogResource,
  getCatalogList,
  updateCatalogResourceStatus
} from '@/modules/Catalog/services'

describe('catalog services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps resource list dto results into frontend models', async () => {
    catalogApiMocks.getResourceList.mockResolvedValue(
      createSuccessResponse({
        items: [
          {
            resource_id: 'resource-001',
            resource_title: 'Operations Overview',
            resource_subtitle: 'Starter resource card',
            resource_description: 'Starter description',
            resource_status: 'active',
            updated_at: '2026-05-29'
          }
        ],
        next_cursor: null,
        total: 1
      })
    )

    const response = await getCatalogList({
      keyword: 'operations'
    })

    expect(catalogApiMocks.getResourceList).toHaveBeenCalledWith({
      keyword: 'operations'
    })
    expect(response.data).toEqual({
      items: [
        {
          id: 'resource-001',
          title: 'Operations Overview',
          subtitle: 'Starter resource card',
          description: 'Starter description',
          status: 'active',
          updatedAt: '2026-05-29'
        }
      ],
      nextCursor: null,
      total: 1
    })
  })

  it('sends dto payloads for create and toggle operations and maps the results', async () => {
    catalogApiMocks.createResource.mockResolvedValue(
      createSuccessResponse({
        resource_id: 'resource-003',
        resource_title: 'New title',
        resource_subtitle: 'New subtitle',
        resource_description: 'New description',
        resource_status: 'draft',
        updated_at: '2026-06-24'
      })
    )
    catalogApiMocks.toggleResourceStatus.mockResolvedValue(
      createSuccessResponse({
        resource_id: 'resource-003',
        resource_status: 'active'
      })
    )

    const createResponse = await createCatalogResource({
      title: 'New title',
      subtitle: 'New subtitle',
      description: 'New description'
    })
    const toggleResponse = await updateCatalogResourceStatus({
      id: 'resource-003'
    })

    expect(catalogApiMocks.createResource).toHaveBeenCalledWith({
      resource_title: 'New title',
      resource_subtitle: 'New subtitle',
      resource_description: 'New description'
    })
    expect(createResponse.data).toEqual({
      id: 'resource-003',
      title: 'New title',
      subtitle: 'New subtitle',
      description: 'New description',
      status: 'draft',
      updatedAt: '2026-06-24'
    })
    expect(toggleResponse.data).toEqual({
      id: 'resource-003',
      status: 'active'
    })
  })
})

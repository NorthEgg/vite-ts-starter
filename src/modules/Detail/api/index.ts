import { createSuccessResponse } from '@/api/core/helpers'
import type { ApiResponse } from '@/api/core/types'
import type { DetailPanel } from '@/store/useDetailStore'

export async function getDetailPanel(
  resourceId: string
): Promise<ApiResponse<DetailPanel>> {
  return createSuccessResponse({
    title: 'Resource Detail',
    summary: `This detail page is ready for resource ${ resourceId }. Replace the summary, sections, and widgets with your own domain content.`,
    sections: [
      {
        id: 'section-overview',
        title: 'Overview',
        description: 'A concise snapshot section for key information.'
      },
      {
        id: 'section-timeline',
        title: 'Timeline',
        description: 'A flexible slot for events, audit history, or progress.'
      },
      {
        id: 'section-notes',
        title: 'Notes',
        description: 'A placeholder for annotations, remarks, or next actions.'
      }
    ]
  })
}

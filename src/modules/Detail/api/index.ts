import { createSuccessResponse } from '@/api/core/helpers'
import type { ApiResponse } from '@/api/core/types'
import type { DetailPanelDTO } from '@/modules/Detail/mappers/detail'

export async function getDetailPanel(
  resourceId: string
): Promise<ApiResponse<DetailPanelDTO>> {
  return createSuccessResponse({
    panel_title: 'Resource Detail',
    panel_summary: `This detail page is ready for resource ${resourceId}. Replace the summary, sections, and widgets with your own domain content.`,
    sections: [
      {
        section_id: 'section-overview',
        section_title: 'Overview',
        section_description: 'A concise snapshot section for key information.'
      },
      {
        section_id: 'section-timeline',
        section_title: 'Timeline',
        section_description:
          'A flexible slot for events, audit history, or progress.'
      },
      {
        section_id: 'section-notes',
        section_title: 'Notes',
        section_description:
          'A placeholder for annotations, remarks, or next actions.'
      }
    ]
  })
}

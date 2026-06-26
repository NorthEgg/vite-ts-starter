import { createSuccessResponse } from '@/api/core/helpers';
import type { ApiResponse } from '@/api/core/types';
import { i18n } from '@/locales';
import type { DetailPanelDTO } from '@/modules/Detail/mappers/detail';

export async function getDetailPanel(
  resourceId: string,
): Promise<ApiResponse<DetailPanelDTO>> {
  return createSuccessResponse({
    panel_title: i18n.global.t('detail.panelTitle'),
    panel_summary: i18n.global.t('detail.panelSummary', {
      resourceId,
    }),
    sections: [
      {
        section_id: 'section-overview',
        section_title: i18n.global.t('detail.sectionOverviewTitle'),
        section_description: i18n.global.t('detail.sectionOverviewDescription'),
      },
      {
        section_id: 'section-timeline',
        section_title: i18n.global.t('detail.sectionTimelineTitle'),
        section_description: i18n.global.t('detail.sectionTimelineDescription'),
      },
      {
        section_id: 'section-notes',
        section_title: i18n.global.t('detail.sectionNotesTitle'),
        section_description: i18n.global.t('detail.sectionNotesDescription'),
      },
    ],
  });
}

import { beforeEach, describe, expect, it, vi } from 'vitest';

const detailApiMocks = vi.hoisted(() => {
  return {
    getDetailPanel: vi.fn(),
  };
});

vi.mock('@/modules/Detail/api', () => detailApiMocks);

import { createErrorResponse, createSuccessResponse } from '@/api/core/helpers';
import { getDetailOverview } from '@/modules/Detail/services';

describe('detail services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps detail panel dto responses into frontend models', async () => {
    detailApiMocks.getDetailPanel.mockResolvedValue(
      createSuccessResponse({
        panel_title: 'Resource Detail',
        panel_summary: 'Summary content',
        sections: [
          {
            section_id: 'section-overview',
            section_title: 'Overview',
            section_description: 'Overview content',
          },
        ],
      }),
    );

    const response = await getDetailOverview('resource-001');

    expect(detailApiMocks.getDetailPanel).toHaveBeenCalledWith('resource-001');
    expect(response.data).toEqual({
      title: 'Resource Detail',
      summary: 'Summary content',
      sections: [
        {
          id: 'section-overview',
          title: 'Overview',
          description: 'Overview content',
        },
      ],
    });
  });

  it('preserves api error responses when detail loading fails', async () => {
    detailApiMocks.getDetailPanel.mockResolvedValue(
      createErrorResponse(
        {
          code: 'detail_not_found',
          message: 'Detail not found',
        },
        null,
      ),
    );

    const response = await getDetailOverview('missing-resource');

    expect(response.success).toBe(false);
    expect(response.error).toMatchObject({
      code: 'detail_not_found',
      message: 'Detail not found',
    });
  });
});

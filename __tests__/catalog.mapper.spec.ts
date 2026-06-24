import { describe, expect, it } from 'vitest';

import {
  toCreateResourcePayloadDTO,
  toResourceListResult,
  toResourceSummary,
  toToggleResourceStatusResult,
} from '@/modules/Catalog/mappers/resource';

describe('catalog resource mapper', () => {
  it('maps resource dto to model', () => {
    const model = toResourceSummary({
      resource_id: 'resource-001',
      resource_title: 'Operations Overview',
      resource_subtitle: 'Starter resource card',
      resource_description: 'Starter description',
      resource_status: 'active',
      updated_at: '2026-05-29',
    });

    expect(model).toEqual({
      id: 'resource-001',
      title: 'Operations Overview',
      subtitle: 'Starter resource card',
      description: 'Starter description',
      status: 'active',
      updatedAt: '2026-05-29',
    });
  });

  it('maps list and command payloads consistently', () => {
    const list = toResourceListResult({
      items: [
        {
          resource_id: 'resource-001',
          resource_title: 'Operations Overview',
          resource_subtitle: 'Starter resource card',
          resource_description: 'Starter description',
          resource_status: 'active',
          updated_at: '2026-05-29',
        },
      ],
      next_cursor: null,
      total: 1,
    });

    const createPayload = toCreateResourcePayloadDTO({
      title: 'New title',
      subtitle: 'New subtitle',
      description: 'New description',
    });

    const toggleResult = toToggleResourceStatusResult({
      resource_id: 'resource-001',
      resource_status: 'draft',
    });

    expect(list.items).toHaveLength(1);
    expect(createPayload).toEqual({
      resource_title: 'New title',
      resource_subtitle: 'New subtitle',
      resource_description: 'New description',
    });
    expect(toggleResult).toEqual({
      id: 'resource-001',
      status: 'draft',
    });
  });
});

import { describe, expect, it } from 'vitest'

import { toDetailPanelModel } from '@/modules/Detail/mappers/detail'

describe('detail panel mapper', () => {
  it('maps detail dto to panel model', () => {
    expect(
      toDetailPanelModel({
        panel_title: 'Resource Detail',
        panel_summary: 'Summary content',
        sections: [
          {
            section_id: 'section-overview',
            section_title: 'Overview',
            section_description: 'Overview content'
          }
        ]
      })
    ).toEqual({
      title: 'Resource Detail',
      summary: 'Summary content',
      sections: [
        {
          id: 'section-overview',
          title: 'Overview',
          description: 'Overview content'
        }
      ]
    })
  })
})

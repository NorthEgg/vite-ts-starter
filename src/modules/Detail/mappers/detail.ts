import type {
  DetailPanelModel,
  DetailSection
} from '@/modules/Detail/models/detail'

export interface DetailSectionDTO {
  section_id: string
  section_title: string
  section_description: string
}

export interface DetailPanelDTO {
  panel_title: string
  panel_summary: string
  sections: DetailSectionDTO[]
}

function toDetailSection(dto: DetailSectionDTO): DetailSection {
  return {
    id: dto.section_id,
    title: dto.section_title,
    description: dto.section_description
  }
}

export function toDetailPanelModel(dto: DetailPanelDTO): DetailPanelModel {
  return {
    title: dto.panel_title,
    summary: dto.panel_summary,
    sections: dto.sections.map(toDetailSection)
  }
}

export interface DetailSection {
  id: string;
  title: string;
  description: string;
}

export interface DetailPanelModel {
  title: string;
  summary: string;
  sections: DetailSection[];
}

export type ResourceStatus = 'draft' | 'active'

export interface ResourceSummary {
  id: string
  title: string
  subtitle: string
  description: string
  status: ResourceStatus
  updatedAt: string
}

export interface ResourceListResult {
  items: ResourceSummary[]
  nextCursor: string | null
  total: number
}

export interface CreateResourcePayload {
  title: string
  subtitle: string
  description: string
}

export interface ToggleResourceStatusResult {
  id: string
  status: ResourceStatus
}

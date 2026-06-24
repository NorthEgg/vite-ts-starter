import type {
  CreateResourcePayload,
  ResourceListResult,
  ResourceStatus,
  ResourceSummary,
  ToggleResourceStatusResult
} from '@/modules/Catalog/models/resource'

export interface ResourceSummaryDTO {
  resource_id: string
  resource_title: string
  resource_subtitle: string
  resource_description: string
  resource_status: ResourceStatus
  updated_at: string
}

export interface ResourceListResultDTO {
  items: ResourceSummaryDTO[]
  next_cursor: string | null
  total: number
}

export interface CreateResourcePayloadDTO {
  resource_title: string
  resource_subtitle: string
  resource_description: string
}

export interface ToggleResourceStatusResultDTO {
  resource_id: string
  resource_status: ResourceStatus
}

export function toResourceSummary(dto: ResourceSummaryDTO): ResourceSummary {
  return {
    id: dto.resource_id,
    title: dto.resource_title,
    subtitle: dto.resource_subtitle,
    description: dto.resource_description,
    status: dto.resource_status,
    updatedAt: dto.updated_at
  }
}

export function toResourceListResult(
  dto: ResourceListResultDTO
): ResourceListResult {
  return {
    items: dto.items.map(toResourceSummary),
    nextCursor: dto.next_cursor,
    total: dto.total
  }
}

export function toCreateResourcePayloadDTO(
  payload: CreateResourcePayload
): CreateResourcePayloadDTO {
  return {
    resource_title: payload.title,
    resource_subtitle: payload.subtitle,
    resource_description: payload.description
  }
}

export function toToggleResourceStatusResult(
  dto: ToggleResourceStatusResultDTO
): ToggleResourceStatusResult {
  return {
    id: dto.resource_id,
    status: dto.resource_status
  }
}

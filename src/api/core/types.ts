export interface ApiErrorShape {
  code: string
  message: string
  details?: Record<string, unknown>
  requestId?: string
}

export interface ApiResponse<TData = unknown> {
  success: boolean
  data: TData
  message: string
  error: ApiErrorShape | null
}

export interface ListQuery {
  keyword?: string
  cursor?: string | null
  limit?: number
}

export interface ListResult<TItem> {
  items: TItem[]
  nextCursor: string | null
  total: number
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

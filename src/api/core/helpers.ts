import { ElMessage } from 'element-plus'

import type { ApiErrorShape, ApiResponse } from './types'

export function createSuccessResponse<TData>(
  data: TData,
  message = 'OK'
): ApiResponse<TData> {
  return {
    success: true,
    data,
    message,
    error: null
  }
}

export function createErrorResponse<TData>(
  error: ApiErrorShape,
  data: TData,
  message = error.message
): ApiResponse<TData> {
  return {
    success: false,
    data,
    message,
    error
  }
}

export async function handleApiResponse<TData>(
  response: ApiResponse<TData>,
  options: {
    onSuccess?: (data: TData) => void | Promise<void>
    onError?: (error: ApiErrorShape) => void | Promise<void>
    silent?: boolean
  } = {}
) {
  if (response.success) {
    await options.onSuccess?.(response.data)
    return response
  }

  if (response.error) {
    await options.onError?.(response.error)

    if (!options.silent) {
      ElMessage({
        type: 'error',
        message: response.error.message,
        showClose: true
      })
    }
  }

  return response
}

export function mapApiResponse<TSource, TTarget>(
  response: ApiResponse<TSource>,
  mapper: (data: TSource) => TTarget
): ApiResponse<TTarget> {
  if (!response.success || response.error) {
    return {
      success: false,
      data: null as unknown as TTarget,
      message: response.message,
      error: response.error
    }
  }

  return createSuccessResponse(mapper(response.data), response.message)
}

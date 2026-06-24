import type { AxiosInstance } from 'axios'
import axios from 'axios'
import Cookie from 'js-cookie'

import type { ApiErrorShape, ApiResponse } from '@/api/core/types'
import { camelizeKeys, decamelizeKeys } from '@/utils/camelCase'

function errorRedirect(url: string) {
  void url
  // Router.push(`/${url}`)
}

export const codeMessage: Record<number, string> = {
  200: 'The server successfully returned the requested data.',
  201: 'Create or modify data successfully.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Data deleted successfully.',
  206: 'Successful range request.',
  400: 'Bad error request, and the server did not create or modify the data.',
  401: 'User does not have permission (invalid username, password, security token).',
  403: 'User is authorized, but access is forbidden.',
  404: 'The request sent is for a record that does not exist, and the server does not operate.',
  405: 'Request denied.',
  406: 'Requested format not available.',
  410: 'The requested resource is permanently deleted and will no longer be available.',
  422: 'When creating an object, a validation error occurrs.',
  500: 'An error occurred in the server, please check the server.',
  502: 'Bad Gateway Error.',
  503: 'The server is temporarily unable to service your request due to maintenance downtime or capacity problems.',
  504: 'Gateway Timeout.'
}

function normalizeError(
  error: unknown,
  fallbackMessage: string
): ApiErrorShape {
  return {
    code: 'request_failed',
    message: fallbackMessage,
    details:
      error && typeof error === 'object'
        ? (error as Record<string, unknown>)
        : undefined
  }
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 15000
})

request.interceptors.request.use(
  (config) => {
    const token = Cookie.get('token')

    if (!(config.data instanceof FormData)) {
      config.data = decamelizeKeys(config.data)
    }

    config.params = decamelizeKeys(config.params)

    if (config.url === '/login') {
      return config
    }

    Object.defineProperty(config.headers, 'Authorization', {
      enumerable: true,
      value: token as string
    })

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const data = response.data
    const contentType = String(response.headers['content-type'] ?? '')

    Promise.resolve().then(() => {
      useResHeadersAPI(response.headers, data)
    })

    if (
      response.request.responseType === 'blob' &&
      /json$/gi.test(contentType)
    ) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          response.data = JSON.parse(reader.result as string)
          resolve(camelizeKeys(response.data))
        }

        reader.readAsText(response.data)
      })
    }

    if (data instanceof Blob) {
      return {
        success: true,
        data,
        message: '',
        error: null
      }
    }

    const normalizedData = camelizeKeys(data)

    if (
      normalizedData &&
      typeof normalizedData === 'object' &&
      'success' in normalizedData &&
      'data' in normalizedData &&
      'error' in normalizedData
    ) {
      return normalizedData
    }

    return {
      success: true,
      data: normalizedData,
      message: normalizedData?.msg || 'OK',
      error: null
    } satisfies ApiResponse
  },
  (error) => {
    if (error.config.redirect) {
      errorRedirect(error.config.redirect)
    }

    if (error.response) {
      return {
        success: false,
        data: null,
        message:
          codeMessage[error.response.status] || error.response.data.message,
        error: {
          code: `http_${error.response.status}`,
          message:
            codeMessage[error.response.status] || error.response.data.message
        }
      } satisfies ApiResponse<null>
    }

    return {
      success: false,
      data: null,
      message: '服务请求不可用，请重试或检查您的网络。',
      error: normalizeError(error, '服务请求不可用，请重试或检查您的网络。')
    } satisfies ApiResponse<null>
  }
)

export function sleep(time = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({})
    }, time)
  })
}

function extractFileNameFromContentDispositionHeader(value: string) {
  const patterns = [
    /filename\*=[^']+'\w*'"([^"]+)";?/i,
    /filename\*=[^']+'\w*'([^;]+);?/i,
    /filename="([^;]*);?"/i,
    /filename=([^;]*);?/i
  ]

  let responseFilename: RegExpExecArray | null = null
  patterns.some((regex) => {
    responseFilename = regex.exec(value)
    return responseFilename !== null
  })

  if (responseFilename?.[1]) {
    try {
      return decodeURIComponent(responseFilename[1])
    } catch (error) {
      console.error(error)
    }
  }

  return null
}

export function downloadFile(
  blobData: Blob | BlobPart,
  filename = 'test-filename',
  type: string
) {
  const blob =
    blobData instanceof Blob
      ? blobData
      : new Blob([blobData], {
          type
        })
  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = filename
  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
}

export function useResHeadersAPI(
  headers: Record<string, unknown>,
  resData: Blob
) {
  const disposition =
    typeof headers['content-disposition'] === 'string'
      ? headers['content-disposition']
      : undefined

  if (disposition) {
    const filename = extractFileNameFromContentDispositionHeader(disposition)
    const contentType =
      typeof headers['content-type'] === 'string'
        ? headers['content-type']
        : 'application/octet-stream'

    if (filename) {
      downloadFile(resData, filename, contentType)
    }
  }
}

export default request

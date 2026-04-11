import { getStoredAccessToken } from '@/lib/auth/auth-storage'
import { appConfig } from '@/lib/config'
import { ApiError } from './api-error'

type JsonLike = Record<string, unknown> | unknown[]

type ApiRequestInit = Omit<RequestInit, 'body'> & {
  accessToken?: string | null
  body?: BodyInit | JsonLike | null
}

function isJsonLikeBody(body: ApiRequestInit['body']): body is JsonLike {
  if (!body || typeof body !== 'object') {
    return false
  }

  return (
    Array.isArray(body) ||
    (!('append' in body) &&
      !(body instanceof URLSearchParams) &&
      !(body instanceof Blob) &&
      !(body instanceof ArrayBuffer))
  )
}

function resolveUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  if (path.startsWith('/api')) {
    return path
  }

  const normalizedBase = appConfig.apiBaseUrl.endsWith('/')
    ? appConfig.apiBaseUrl.slice(0, -1)
    : appConfig.apiBaseUrl

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function extractMessage(data: unknown) {
  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (data && typeof data === 'object') {
    const maybeMessage = 'message' in data ? data.message : 'Message' in data ? data.Message : null

    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage
    }
  }

  return null
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  if (!text.trim()) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export async function apiClient<T>(path: string, init: ApiRequestInit = {}) {
  const headers = new Headers(init.headers)
  const accessToken = init.accessToken ?? getStoredAccessToken()
  const requestBody = isJsonLikeBody(init.body) ? JSON.stringify(init.body) : init.body

  if (requestBody && !headers.has('Content-Type') && isJsonLikeBody(init.body)) {
    headers.set('Content-Type', 'application/json')
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(resolveUrl(path), {
    ...init,
    headers,
    body: requestBody,
  })

  const data = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiError(
      extractMessage(data) || `Request failed with status ${response.status}.`,
      {
        status: response.status,
        data,
      },
    )
  }

  return data as T
}

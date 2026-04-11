type ApiErrorOptions = {
  status: number
  data?: unknown
}

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, options: ApiErrorOptions) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.data = options.data
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallback
}

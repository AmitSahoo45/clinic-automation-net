const ACCESS_TOKEN_STORAGE_KEY = 'clinic-appointments.access-token'

export function getStoredAccessToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function setStoredAccessToken(accessToken: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
}

export function clearStoredAccessToken() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export { ACCESS_TOKEN_STORAGE_KEY }

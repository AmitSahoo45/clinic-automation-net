function normalizeValue(value: string | undefined) {
  return value?.trim() || undefined
}

export const appConfig = {
  appName: normalizeValue(import.meta.env.VITE_APP_NAME) || 'Clinic Appointments',
  apiBaseUrl: normalizeValue(import.meta.env.VITE_API_BASE_URL) || '/api',
}

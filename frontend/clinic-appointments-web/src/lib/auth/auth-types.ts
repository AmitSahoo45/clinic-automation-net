export type UserRole = 'Doctor' | 'Patient'

export type SessionUser = {
  userId: string
  email: string
  role: UserRole
}

export type AuthResponsePayload = SessionUser & {
  accessToken: string
  expiresAtUtc: string
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function readString(record: UnknownRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return null
}

export function normalizeUserRole(value: unknown): UserRole | null {
  if (typeof value === 'number') {
    if (value === 1) {
      return 'Doctor'
    }

    if (value === 2) {
      return 'Patient'
    }

    return null
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()

    if (normalized === 'doctor' || normalized === '1') {
      return 'Doctor'
    }

    if (normalized === 'patient' || normalized === '2') {
      return 'Patient'
    }
  }

  return null
}

export function parseSessionUser(payload: unknown): SessionUser {
  if (!isRecord(payload)) {
    throw new Error('Expected a session payload object from the API.')
  }

  const userId = readString(payload, 'userId', 'UserId')
  const email = readString(payload, 'email', 'Email')
  const role = normalizeUserRole(payload.role ?? payload.Role)

  if (!userId || !email || !role) {
    throw new Error('The session payload from the API was missing one or more required fields.')
  }

  return {
    userId,
    email,
    role,
  }
}

export function parseAuthResponse(payload: unknown): AuthResponsePayload {
  if (!isRecord(payload)) {
    throw new Error('Expected an auth response object from the API.')
  }

  const accessToken = readString(payload, 'accessToken', 'AccessToken')
  const expiresAtUtc = readString(payload, 'expiresAtUtc', 'ExpiresAtUtc')
  const user = parseSessionUser(payload)

  if (!accessToken || !expiresAtUtc) {
    throw new Error('The auth response from the API was missing the token or expiry.')
  }

  return {
    ...user,
    accessToken,
    expiresAtUtc,
  }
}

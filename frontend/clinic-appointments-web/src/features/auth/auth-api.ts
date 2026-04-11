import { apiClient } from '@/lib/api/api-client'
import { type AuthResponsePayload, type UserRole, parseAuthResponse } from '@/lib/auth/auth-types'
import type {
  DoctorRegisterValues,
  LoginValues,
  PatientRegisterValues,
} from '@/features/auth/auth-schemas'

export async function loginWithRole(role: UserRole, values: LoginValues) {
  const path = role === 'Doctor' ? '/auth/doctors/login' : '/auth/patients/login'
  const payload = await apiClient<unknown>(path, {
    method: 'POST',
    body: values,
  })

  return parseAuthResponse(payload)
}

export async function registerWithRole(
  role: UserRole,
  values: DoctorRegisterValues | PatientRegisterValues,
) {
  const path = role === 'Doctor' ? '/auth/doctors/register' : '/auth/patients/register'
  const payload = await apiClient<unknown>(path, {
    method: 'POST',
    body: values,
  })

  return parseAuthResponse(payload)
}

export function getAuthSuccessMessage(mode: 'login' | 'register', payload: AuthResponsePayload) {
  const action = mode === 'login' ? 'Welcome back' : 'Welcome'
  const roleLabel = payload.role === 'Doctor' ? 'doctor' : 'patient'
  return `${action}, ${roleLabel}. Your workspace is ready.`
}

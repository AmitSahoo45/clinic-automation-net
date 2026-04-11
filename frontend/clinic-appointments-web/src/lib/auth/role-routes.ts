import type { UserRole } from './auth-types'

export function getDefaultRouteForRole(role: UserRole) {
  return role === 'Doctor' ? '/doctor/profile' : '/patient/doctors'
}

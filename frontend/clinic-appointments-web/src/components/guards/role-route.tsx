import { Navigate, Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/app/loading-screen'
import type { UserRole } from '@/lib/auth/auth-types'
import { getDefaultRouteForRole } from '@/lib/auth/role-routes'
import { useSession } from '@/lib/auth/session-context'

type RoleRouteProps = {
  role: UserRole
}

export function RoleRoute({ role }: RoleRouteProps) {
  const { status, user } = useSession()

  if (status === 'checking') {
    return <LoadingScreen message="Aligning your role-specific workspace." />
  }

  if (status === 'anonymous' || !user) {
    return <Navigate replace to="/login" />
  }

  if (user.role !== role) {
    return <Navigate replace to={getDefaultRouteForRole(user.role)} />
  }

  return <Outlet />
}

import { Navigate, Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/app/loading-screen'
import { getDefaultRouteForRole } from '@/lib/auth/role-routes'
import { useSession } from '@/lib/auth/session-context'

export function PublicOnlyRoute() {
  const { status, user } = useSession()

  if (status === 'checking') {
    return <LoadingScreen message="Recovering the last signed-in workspace before showing public routes." />
  }

  if (status === 'authenticated' && user) {
    return <Navigate replace to={getDefaultRouteForRole(user.role)} />
  }

  return <Outlet />
}

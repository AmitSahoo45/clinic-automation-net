import { Navigate } from 'react-router-dom'
import { LoadingScreen } from '@/components/app/loading-screen'
import { getDefaultRouteForRole } from '@/lib/auth/role-routes'
import { useSession } from '@/lib/auth/session-context'

export function RootRedirect() {
  const { status, user } = useSession()

  if (status === 'checking') {
    return <LoadingScreen message="Deciding whether to send you to public auth pages or your workspace." />
  }

  if (user) {
    return <Navigate replace to={getDefaultRouteForRole(user.role)} />
  }

  return <Navigate replace to="/login" />
}

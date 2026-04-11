import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingScreen } from '@/components/app/loading-screen'
import { useSession } from '@/lib/auth/session-context'

export function AuthenticatedRoute() {
  const location = useLocation()
  const { status } = useSession()

  if (status === 'checking') {
    return <LoadingScreen message="Checking your sign-in and restoring your account." />
  }

  if (status === 'anonymous') {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}

import { AlertCircle } from 'lucide-react'
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { StatePanel } from '@/components/app/state-panel'
import { buttonVariants } from '@/components/ui/button-variants'
import { getDefaultRouteForRole } from '@/lib/auth/role-routes'
import { useSession } from '@/lib/auth/session-context'
import { cn } from '@/lib/utils'

function getRouteErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return 'The page you requested could not be found.'
    }

    return error.statusText || 'The page could not be loaded right now.'
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return 'Something unexpected happened while loading this page.'
}

export function RouteErrorPage() {
  const error = useRouteError()
  const { user } = useSession()
  const homeTarget = user ? getDefaultRouteForRole(user.role) : '/login'

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <StatePanel
          description={getRouteErrorMessage(error)}
          icon={AlertCircle}
          title="This page is unavailable right now"
          tone="error"
        >
          <Link className={cn(buttonVariants())} to={homeTarget}>
            Return to home
          </Link>
        </StatePanel>
      </div>
    </div>
  )
}

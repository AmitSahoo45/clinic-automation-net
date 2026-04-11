import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDefaultRouteForRole } from '@/lib/auth/role-routes'
import { useSession } from '@/lib/auth/session-context'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  const { user } = useSession()
  const homeTarget = user ? getDefaultRouteForRole(user.role) : '/login'

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>That route does not exist yet.</CardTitle>
          <CardDescription>
            The frontend shell is in place, but this specific path has not been mapped into the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link className={cn(buttonVariants())} to={homeTarget}>
            Go back to the app
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

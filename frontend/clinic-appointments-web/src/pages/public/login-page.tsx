import { Link } from 'react-router-dom'
import { FeaturePreview } from '@/components/app/feature-preview'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ACCESS_TOKEN_STORAGE_KEY } from '@/lib/auth/auth-storage'
import { cn } from '@/lib/utils'

export function LoginPage() {
  return (
    <div className="space-y-6">
      <FeaturePreview
        checklist={[
          'Public-only route guards keep signed-in users out of auth pages.',
          'JWT restore is already wired through localStorage and /api/auth/me.',
          'Successful sign-in will later redirect by role instead of using separate apps.',
        ]}
        description="The real login forms land in Task 2. For now, this page proves that the public shell, redirect behavior, and auth bootstrap layer are in place."
        endpoints={['POST /api/auth/doctors/login', 'POST /api/auth/patients/login', 'GET /api/auth/me']}
        eyebrow="login foundation"
        title="The login route is ready for the real auth form."
      />

      <Card>
        <CardHeader>
          <CardTitle>Quick testing before Task 2</CardTitle>
          <CardDescription>
            If you want to test session restore right now, you can drop a valid JWT from Postman into
            localStorage and refresh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-muted px-4 py-4 text-sm leading-6 text-foreground">
            <code>
              localStorage.setItem('{ACCESS_TOKEN_STORAGE_KEY}', '&lt;your-jwt-here&gt;')
            </code>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={cn(buttonVariants({ variant: 'outline' }))} to="/register">
              Switch to register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

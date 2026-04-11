import { Link } from 'react-router-dom'
import { FeaturePreview } from '@/components/app/feature-preview'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function RegisterPage() {
  return (
    <div className="space-y-6">
      <FeaturePreview
        checklist={[
          'Doctor and patient registration will share the same frontend shell.',
          'Role-based redirects are already wired behind this page.',
          'The next task only needs to focus on forms, validation, and API submission.',
        ]}
        description="This route is intentionally light right now. The important groundwork is that the public shell exists, auth redirects work, and the app can restore a prior session cleanly."
        endpoints={['POST /api/auth/doctors/register', 'POST /api/auth/patients/register', 'GET /api/auth/me']}
        eyebrow="registration foundation"
        title="The registration route is staged for doctor and patient onboarding."
      />

      <Card>
        <CardHeader>
          <CardTitle>Why the form is deferred</CardTitle>
          <CardDescription>
            We are separating the app skeleton from the auth flow so the next step can focus only on
            validation, mutations, and role-aware success handling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link className={cn(buttonVariants({ variant: 'outline' }))} to="/login">
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

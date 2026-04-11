import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from '@/lib/auth/session-context'

type FeaturePreviewProps = {
  eyebrow: string
  title: string
  description: string
  endpoints: string[]
  checklist: string[]
  tone?: 'neutral' | 'doctor' | 'patient'
  note?: string
}

export function FeaturePreview({
  eyebrow,
  title,
  description,
  endpoints,
  checklist,
  tone = 'neutral',
  note,
}: FeaturePreviewProps) {
  const { status, user } = useSession()
  const badgeVariant =
    tone === 'doctor' ? 'doctor' : tone === 'patient' ? 'patient' : 'secondary'

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Badge variant={badgeVariant}>{eyebrow}</Badge>
        <div className="space-y-3">
          <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Available services</CardTitle>
            <CardDescription>These are the API endpoints connected to this page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {endpoints.map((endpoint) => (
                <code
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground"
                  key={endpoint}
                >
                  {endpoint}
                </code>
              ))}
            </div>

            <div className="grid gap-3">
              {checklist.map((item) => (
                <div className="flex items-start gap-3 rounded-2xl bg-muted/70 px-4 py-3" key={item}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm leading-6 text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current account</CardTitle>
            <CardDescription>Review the account currently signed in to the portal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'authenticated' && user ? (
              <>
                <div className="rounded-2xl bg-accent/60 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    signed in
                  </p>
                  <p className="mt-2 font-semibold text-foreground">{user.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{user.role} account active</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Refreshing the page restores the signed-in account through <code>/api/auth/me</code>.
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-muted/70 px-4 py-4">
                <p className="text-sm leading-6 text-foreground">
                  No account is signed in right now. Sign in or create an account to continue.
                </p>
              </div>
            )}

            {note ? <p className="text-sm leading-6 text-muted-foreground">{note}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

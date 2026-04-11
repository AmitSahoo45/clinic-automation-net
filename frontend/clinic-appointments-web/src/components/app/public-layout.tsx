import { ArrowRight, ShieldCheck, Stethoscope, UserRound } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BrandMark } from '@/components/app/brand-mark'
import { buttonVariants } from '@/components/ui/button-variants'
import { appConfig } from '@/lib/config'
import { cn } from '@/lib/utils'

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Session bootstrap',
    description: 'JWT restore and /api/auth/me identity recovery are active before we build the forms.',
  },
  {
    icon: Stethoscope,
    title: 'Doctor-only lanes',
    description: 'Protected doctor routes already redirect correctly and are ready for profile and schedule work.',
  },
  {
    icon: UserRound,
    title: 'Patient-only lanes',
    description: 'Patient routes are isolated too, so browse-and-book flows can land safely in the next tasks.',
  },
]

export function PublicLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(140deg,#0f766e,#155e75_55%,#172554)] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.15),transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <BrandMark />
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/80 backdrop-blur">
                phase 6 task 1
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/70">frontend foundation</p>
              <h1 className="max-w-xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                One workspace, two roles, and a calmer path into the UI build.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-white/82 md:text-lg">
                We are setting up the shell now so the doctor and patient flows can plug in without
                rerouting the whole app later. The local API base is currently pointed at{' '}
                <code className="rounded-full bg-white/10 px-3 py-1 text-white">{appConfig.apiBaseUrl}</code>.
              </p>
            </div>

            <div className="grid gap-4">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div
                  className="flex items-start gap-4 rounded-[1.6rem] border border-white/14 bg-white/8 px-5 py-4 backdrop-blur"
                  key={title}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm leading-6 text-white/74">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                  'bg-white text-slate-900 hover:bg-white/90',
                )}
                to="/login"
              >
                Go to login
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'lg' }),
                  'border border-white/20 bg-white/6 text-white hover:bg-white/14 hover:text-white',
                )}
                to="/register"
              >
                Go to register
              </Link>
            </div>
          </div>
        </section>

        <section className="flex min-h-[640px] items-center">
          <div className="w-full rounded-[2.25rem] border border-border/80 bg-card/92 p-6 shadow-[0_24px_80px_rgba(22,56,54,0.14)] backdrop-blur md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">public routes</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Authenticated users are redirected away from these screens automatically.
                </p>
              </div>
              <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {location.pathname}
              </div>
            </div>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}

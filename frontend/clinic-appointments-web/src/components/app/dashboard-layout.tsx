import { AlertCircle, CalendarDays, LayoutDashboard, LogOut, Stethoscope } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '@/components/app/brand-mark'
import { StatePanel } from '@/components/app/state-panel'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth/session-context'
import { cn } from '@/lib/utils'

const doctorNavigation = [
  { to: '/doctor/profile', label: 'Profile', icon: Stethoscope },
  { to: '/doctor/schedules', label: 'Schedules', icon: CalendarDays },
  { to: '/doctor/appointments', label: 'Appointments', icon: LayoutDashboard },
]

const patientNavigation = [
  { to: '/patient/doctors', label: 'Find a Doctor', icon: Stethoscope },
  { to: '/patient/appointments', label: 'My Appointments', icon: CalendarDays },
]

export function DashboardLayout() {
  const { signOut, user } = useSession()

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          <StatePanel
            description="Your session is not available right now. Please sign in again to continue."
            icon={AlertCircle}
            title="Please sign in to continue"
            tone="warning"
          >
            <Link className={cn(buttonVariants())} to="/login">
              Go to sign in
            </Link>
          </StatePanel>
        </div>
      </div>
    )
  }

  const navigation = user.role === 'Doctor' ? doctorNavigation : patientNavigation
  const badgeVariant = user.role === 'Doctor' ? 'doctor' : 'patient'

  return (
    <div className="min-h-screen px-4 py-4 lg:px-8 lg:py-6">
      <div className="mx-auto grid max-w-[1560px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="rounded-4xl bg-[linear-gradient(180deg,#123d3a,#0f2b3f)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)] lg:sticky lg:top-6 lg:self-start">
          <div className="flex h-full flex-col gap-8">
            <BrandMark compact />

            <div className="rounded-3xl border border-white/12 bg-white/8 p-5 backdrop-blur">
              <Badge className="border-transparent bg-white/14 text-white" variant={badgeVariant}>
                {user.role}
              </Badge>
              <p className="mt-4 text-sm uppercase tracking-[0.24em] text-white/60">signed in as</p>
              <p className="mt-2 text-sm font-semibold text-white break-all">{user.email}</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Review appointments, schedules, and account details from one secure clinic portal.
              </p>
            </div>

            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {navigation.map(({ to, label, icon: Icon }) => (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({ variant: 'ghost', size: 'lg' }),
                      'justify-start rounded-2xl text-white hover:bg-white/12 hover:text-white',
                      isActive && 'bg-white text-slate-900 hover:bg-white/80 hover:text-slate-900',
                    )
                  }
                  key={to}
                  to={to}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto rounded-3xl border border-white/12 bg-white/6 p-4 text-sm leading-6 text-white/70">
              Designed to keep daily appointment work simple for patients and clinicians.
            </div>
          </div>
        </aside>

        <main className="min-w-0 rounded-4xl border border-border/80 bg-card/90 p-5 shadow-[0_24px_80px_rgba(22,56,54,0.14)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-4 border-b border-border/80 pb-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                {user.role === 'Doctor' ? 'doctor account' : 'patient account'}
              </p>
              <h1 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {user.role === 'Doctor'
                  ? 'Manage your clinic schedule'
                  : 'Plan your next visit'}
              </h1>
            </div>
            <Button className="w-full self-start sm:w-auto" onClick={signOut} variant="outline">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>

          <div className="pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

import { CalendarDays, LayoutDashboard, LogOut, Stethoscope, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '@/components/app/brand-mark'
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
  { to: '/patient/doctors/demo', label: 'Doctor Detail', icon: UserRound },
  { to: '/patient/appointments', label: 'My Appointments', icon: CalendarDays },
]

export function DashboardLayout() {
  const { signOut, user } = useSession()

  if (!user) {
    return null
  }

  const navigation = user.role === 'Doctor' ? doctorNavigation : patientNavigation
  const badgeVariant = user.role === 'Doctor' ? 'doctor' : 'patient'

  return (
    <div className="min-h-screen px-4 py-4 lg:px-8 lg:py-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[290px_1fr]">
        <aside className="rounded-4xl bg-[linear-gradient(180deg,#123d3a,#0f2b3f)] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)]">
          <div className="flex h-full flex-col gap-8">
            <BrandMark compact />

            <div className="rounded-3xl border border-white/12 bg-white/8 p-5 backdrop-blur">
              <Badge className="border-transparent bg-white/14 text-white" variant={badgeVariant}>
                {user.role}
              </Badge>
              <p className="mt-4 text-sm uppercase tracking-[0.24em] text-white/60">active user</p>
              <p className="mt-2 text-sm font-semibold text-white break-all">{user.email}</p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                Route guards are now role-aware, so this shell only renders the correct workspace.
              </p>
            </div>

            <nav className="grid gap-2">
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

            <div className="mt-auto rounded-[1.5rem] border border-white/12 bg-white/6 p-4 text-sm leading-6 text-white/70">
              This is the shared shell for Phase 6. Task 2 will turn the auth pages into live forms,
              and the next vertical slices will plug real data into these routes.
            </div>
          </div>
        </aside>

        <main className="rounded-[2rem] border border-border/80 bg-card/90 p-5 shadow-[0_24px_80px_rgba(22,56,54,0.14)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-4 border-b border-border/80 pb-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">
                {user.role === 'Doctor' ? 'doctor workspace' : 'patient workspace'}
              </p>
              <h1 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                {user.role === 'Doctor'
                  ? 'Ready for profile, schedule, and appointment screens'
                  : 'Ready for browse, book, and appointment screens'}
              </h1>
            </div>
            <Button className="self-start" onClick={signOut} variant="outline">
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

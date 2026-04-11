import { Stethoscope, UserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { BrandMark } from '@/components/app/brand-mark'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

const highlights = [
  {
    icon: Stethoscope,
    title: 'Doctor schedules',
    description: 'Keep availability current, review upcoming visits, and stay in control of your day.',
  },
  {
    icon: UserRound,
    title: 'Patient booking',
    description: 'Help patients find the right doctor, choose a time, and manage bookings with ease.',
  },
]

export function PublicLayout() {
  return (
    <div className="min-h-screen px-3 py-4 md:px-6 lg:px-8 2xl:px-10">
      <div className="mx-auto grid max-w-445 gap-4 lg:gap-6 xl:grid-cols-[minmax(760px,1.12fr)_minmax(700px,0.88fr)] xl:gap-8">
        <section className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(140deg,#0f766e,#155e75_55%,#172554)] p-7 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-10 xl:min-h-[calc(100vh-2rem)] xl:p-14 2xl:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.15),transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <BrandMark />
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/80 backdrop-blur">
                patient and doctor portal
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.32em] text-white/70">clinic automation</p>
              <h1 className="max-w-2xl font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl xl:text-[5.1rem]">
                Appointments, schedules, and clinic visits in one place.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-white/82 md:text-lg xl:text-[1.18rem]">
                Keep front-desk coordination simple, give doctors a clear view of their day, and let
                patients book care without the usual back-and-forth.
              </p>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
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

            <div className="rounded-[1.6rem] border border-white/14 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.24em] text-white/68">built for daily care</p>
              <p className="mt-3 text-sm leading-7 text-white/82">
                From first-time consultations to follow-up visits, the portal keeps scheduling clear for
                staff and convenient for patients.
              </p>
            </div>
          </div>
        </section>

        <section className="flex min-h-160 items-center xl:min-h-[calc(100vh-2rem)]">
          <div className="h-full w-full rounded-[2.25rem] border border-border/80 bg-card/92 p-6 shadow-[0_24px_80px_rgba(22,56,54,0.14)] backdrop-blur md:p-8 xl:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">account access</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Sign in to your account or create a new one to continue.
                </p>
              </div>
              <div className="flex gap-2 rounded-full bg-muted p-1">
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'sm' }),
                      'rounded-full',
                    )
                  }
                  to="/login"
                >
                  Login
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      buttonVariants({ variant: isActive ? 'default' : 'ghost', size: 'sm' }),
                      'rounded-full',
                    )
                  }
                  to="/register"
                >
                  Register
                </NavLink>
              </div>
            </div>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}

import { startTransition, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, BadgeCheck, Stethoscope, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/api/api-error'
import { type UserRole } from '@/lib/auth/auth-types'
import { getDefaultRouteForRole } from '@/lib/auth/role-routes'
import { useSession } from '@/lib/auth/session-context'
import { cn } from '@/lib/utils'
import { getAuthSuccessMessage, loginWithRole, registerWithRole } from './auth-api'
import {
  doctorRegisterSchema,
  loginSchema,
  patientRegisterSchema,
  type DoctorRegisterValues,
  type LoginValues,
  type PatientRegisterValues,
} from './auth-schemas'

type AuthMode = 'login' | 'register'

type AuthScreenProps = {
  mode: AuthMode
}

type RouteState = {
  from?: {
    pathname?: string
  }
}

const roleCards = {
  Doctor: {
    badge: 'For doctors',
    title: 'Manage availability, appointments, and clinic details with confidence.',
    description:
      'Stay on top of your schedule, review upcoming visits, and keep your professional details up to date.',
    icon: Stethoscope,
    highlights: ['Availability planning', 'Upcoming visits', 'Profile updates'],
  },
  Patient: {
    badge: 'For patients',
    title: 'Find the right doctor, book a visit, and keep appointments organized.',
    description:
      'Browse available doctors, choose a time that works for you, and stay on top of upcoming care.',
    icon: UserRound,
    highlights: ['Browse specialists', 'Reserve time slots', 'Appointment tracking'],
  },
} satisfies Record<
  UserRole,
  {
    badge: string
    title: string
    description: string
    icon: typeof Stethoscope
    highlights: string[]
  }
>

function resolvePostAuthPath(role: UserRole, pathname?: string) {
  if (pathname) {
    if (role === 'Doctor' && pathname.startsWith('/doctor')) {
      return pathname
    }

    if (role === 'Patient' && pathname.startsWith('/patient')) {
      return pathname
    }
  }

  return getDefaultRouteForRole(role)
}

function AuthField({
  children,
  error,
  helper,
  label,
}: {
  children: React.ReactNode
  error?: string
  helper?: string
  label: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
      {!error && helper ? <span className="text-xs text-muted-foreground">{helper}</span> : null}
    </label>
  )
}

function RoleToggle({
  onChange,
  role,
}: {
  role: UserRole
  onChange: (role: UserRole) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-[1.4rem] bg-muted p-1">
      {(['Patient', 'Doctor'] as const).map((option) => {
        const Icon = option === 'Doctor' ? Stethoscope : UserRound

        return (
          <button
            className={cn(
              'flex items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 text-sm font-semibold transition-colors',
              role === option
                ? 'bg-card text-foreground shadow-[0_10px_30px_rgba(22,56,54,0.12)]'
                : 'text-muted-foreground hover:text-foreground',
            )}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            <Icon className="h-4 w-4" />
            {option}
          </button>
        )
      })}
    </div>
  )
}

function AuthSubmitButton(props: ButtonProps & { isPending: boolean }) {
  const { children, isPending, ...rest } = props

  return (
    <Button className="w-full" disabled={isPending} size="lg" type="submit" {...rest}>
      {isPending ? 'Please wait...' : children}
      {!isPending ? <ArrowRight className="h-4 w-4" /> : null}
    </Button>
  )
}

function LoginForm({
  onSubmit,
  pending,
}: {
  pending: boolean
  onSubmit: (values: LoginValues) => void
}) {
  const form = useForm<LoginValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <AuthField error={form.formState.errors.email?.message} label="Email">
        <Input autoComplete="email" placeholder="you@example.com" {...form.register('email')} />
      </AuthField>

      <AuthField error={form.formState.errors.password?.message} label="Password">
        <Input
          autoComplete="current-password"
          placeholder="Enter your password"
          type="password"
          {...form.register('password')}
        />
      </AuthField>

      <AuthSubmitButton isPending={pending}>Sign in</AuthSubmitButton>
    </form>
  )
}

function PatientRegisterForm({
  onSubmit,
  pending,
}: {
  pending: boolean
  onSubmit: (values: PatientRegisterValues) => void
}) {
  const form = useForm<PatientRegisterValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
    resolver: zodResolver(patientRegisterSchema),
  })

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <AuthField error={form.formState.errors.firstName?.message} label="First name">
          <Input autoComplete="given-name" placeholder="Ava" {...form.register('firstName')} />
        </AuthField>

        <AuthField error={form.formState.errors.lastName?.message} label="Last name">
          <Input autoComplete="family-name" placeholder="Patel" {...form.register('lastName')} />
        </AuthField>
      </div>

      <AuthField error={form.formState.errors.email?.message} label="Email">
        <Input autoComplete="email" placeholder="ava.patel@example.com" {...form.register('email')} />
      </AuthField>

      <div className="grid gap-4 md:grid-cols-2">
        <AuthField error={form.formState.errors.password?.message} label="Password">
          <Input
            autoComplete="new-password"
            placeholder="At least 8 characters"
            type="password"
            {...form.register('password')}
          />
        </AuthField>

        <AuthField
          error={form.formState.errors.phoneNumber?.message}
          helper=""
          label="Phone number"
        >
          <Input autoComplete="tel" placeholder="9876543210" {...form.register('phoneNumber')} />
        </AuthField>
      </div>

      <AuthSubmitButton isPending={pending}>Create patient account</AuthSubmitButton>
    </form>
  )
}

function DoctorRegisterForm({
  onSubmit,
  pending,
}: {
  pending: boolean
  onSubmit: (values: DoctorRegisterValues) => void
}) {
  const form = useForm<DoctorRegisterValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      specialization: '',
      bio: '',
    },
    resolver: zodResolver(doctorRegisterSchema),
  })

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <AuthField error={form.formState.errors.firstName?.message} label="First name">
          <Input autoComplete="given-name" placeholder="Maya" {...form.register('firstName')} />
        </AuthField>

        <AuthField error={form.formState.errors.lastName?.message} label="Last name">
          <Input autoComplete="family-name" placeholder="Sharma" {...form.register('lastName')} />
        </AuthField>
      </div>

      <AuthField error={form.formState.errors.email?.message} label="Email">
        <Input autoComplete="email" placeholder="dr.maya@example.com" {...form.register('email')} />
      </AuthField>

      <div className="grid gap-4 md:grid-cols-2">
        <AuthField error={form.formState.errors.password?.message} label="Password">
          <Input
            autoComplete="new-password"
            placeholder="At least 8 characters"
            type="password"
            {...form.register('password')}
          />
        </AuthField>

        <AuthField
          error={form.formState.errors.phoneNumber?.message}
          helper=""
          label="Phone number"
        >
          <Input autoComplete="tel" placeholder="9876543210" {...form.register('phoneNumber')} />
        </AuthField>
      </div>

      <AuthField error={form.formState.errors.specialization?.message} label="Specialization">
        <Input placeholder="Cardiology" {...form.register('specialization')} />
      </AuthField>

      <AuthField error={form.formState.errors.bio?.message} helper="Optional" label="Bio">
        <Textarea placeholder="Briefly describe your practice." {...form.register('bio')} />
      </AuthField>

      <AuthSubmitButton isPending={pending}>Create doctor account</AuthSubmitButton>
    </form>
  )
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const [role, setRole] = useState<UserRole>('Patient')
  const navigate = useNavigate()
  const location = useLocation()
  const { establishSession } = useSession()

  const mutation = useMutation({
    mutationFn: async (values: LoginValues | PatientRegisterValues | DoctorRegisterValues) => {
      if (mode === 'login') {
        return loginWithRole(role, values as LoginValues)
      }

      return registerWithRole(role, values as DoctorRegisterValues | PatientRegisterValues)
    },
    onSuccess: (payload) => {
      establishSession(payload)
      toast.success(getAuthSuccessMessage(mode, payload))

      const fromPath = (location.state as RouteState | null)?.from?.pathname
      startTransition(() => {
        navigate(resolvePostAuthPath(payload.role, fromPath), { replace: true })
      })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not complete the authentication request.'))
    },
  })

  const routeCopy =
    mode === 'login'
      ? {
          eyebrow: 'Welcome back',
          title: 'Sign in to your clinic workspace',
          description:
            'Choose whether you are logging in as a doctor or a patient, then continue into the correct workspace.',
          alternateLabel: "Don't have an account yet?",
          alternateAction: 'Create one',
          alternateTo: '/register',
        }
      : {
          eyebrow: 'Create account',
          title: 'Set up a doctor or patient account',
          description:
            'Create your account to start managing appointments, schedules, and bookings in one place.',
          alternateLabel: 'Already registered?',
          alternateAction: 'Sign in',
          alternateTo: '/login',
        }

  const selectedRoleCard = roleCards[role]
  const RoleIcon = selectedRoleCard.icon
  const attemptedPath = (location.state as RouteState | null)?.from?.pathname
  const errorMessage = mutation.isError
    ? getErrorMessage(mutation.error, 'We could not complete that request.')
    : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge variant={role === 'Doctor' ? 'doctor' : 'patient'}>{routeCopy.eyebrow}</Badge>
          <div className="space-y-2">
            <h1 className="max-w-3xl font-serif text-4xl leading-[1.04] tracking-tight text-foreground md:text-5xl xl:text-[3.8rem]">
              {routeCopy.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground xl:text-lg">
              {routeCopy.description}
            </p>
          </div>
        </div>

        <div className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
          {routeCopy.alternateLabel}{' '}
          <Link className="font-semibold text-primary hover:text-primary/80" to={routeCopy.alternateTo}>
            {routeCopy.alternateAction}
          </Link>
        </div>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]">
        <Card className="border-border/90">
          <CardContent className="space-y-6 p-6 md:p-7">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <RoleIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                    select account type
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Pick the option that matches how you use the clinic portal.
                  </p>
                </div>
              </div>
              <RoleToggle onChange={setRole} role={role} />
            </div>

            {errorMessage ? (
              <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {mode === 'login' ? (
              <LoginForm onSubmit={(values) => mutation.mutate(values)} pending={mutation.isPending} />
            ) : role === 'Doctor' ? (
              <DoctorRegisterForm
                onSubmit={(values) => mutation.mutate(values)}
                pending={mutation.isPending}
              />
            ) : (
              <PatientRegisterForm
                onSubmit={(values) => mutation.mutate(values)}
                pending={mutation.isPending}
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden border-border/90">
            <CardContent className="space-y-5 p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <RoleIcon className="h-5 w-5" />
                </div>
                <div>
                  <Badge variant={role === 'Doctor' ? 'doctor' : 'patient'}>
                    {selectedRoleCard.badge}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-serif text-3xl leading-tight tracking-tight text-foreground">
                  {selectedRoleCard.title}
                </h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  {selectedRoleCard.description}
                </p>
              </div>

              <div className="grid gap-3">
                {selectedRoleCard.highlights.map((item) => (
                  <div className="flex items-center gap-3 rounded-[1.2rem] bg-muted px-4 py-3" key={item}>
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

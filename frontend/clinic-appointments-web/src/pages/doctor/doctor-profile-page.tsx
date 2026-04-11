import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Mail, Phone, Stethoscope } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { StatePanel } from '@/components/app/state-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getDoctorProfile, updateDoctorProfile } from '@/features/doctor/doctor-api'
import {
  doctorProfileSchema,
  type DoctorProfileValues,
} from '@/features/doctor/doctor-schemas'
import { getErrorMessage } from '@/lib/api/api-error'
import { useSession } from '@/lib/auth/session-context'

function ProfileField({
  children,
  error,
  label,
}: {
  children: React.ReactNode
  error?: string
  label: string
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  )
}

export function DoctorProfilePage() {
  const queryClient = useQueryClient()
  const { updateSessionUser } = useSession()
  const form = useForm<DoctorProfileValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      specialization: '',
      phoneNumber: '',
      bio: '',
    },
    resolver: zodResolver(doctorProfileSchema),
  })

  const profileQuery = useQuery({
    queryKey: ['doctor', 'profile'],
    queryFn: getDoctorProfile,
  })

  useEffect(() => {
    if (!profileQuery.data) {
      return
    }

    form.reset({
      firstName: profileQuery.data.firstName,
      lastName: profileQuery.data.lastName,
      email: profileQuery.data.email,
      specialization: profileQuery.data.specialization,
      phoneNumber: profileQuery.data.phoneNumber ?? '',
      bio: profileQuery.data.bio ?? '',
    })
  }, [form, profileQuery.data])

  const updateMutation = useMutation({
    mutationFn: (values: DoctorProfileValues) => updateDoctorProfile(values),
    onSuccess: async (profile) => {
      toast.success('Profile details saved.')
      updateSessionUser({
        userId: profile.id,
        email: profile.email,
        role: 'Doctor',
      })
      await queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not save your profile right now.'))
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_18px_60px_rgba(22,56,54,0.08)] md:p-7 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <Badge variant="doctor">Profile</Badge>
          <div className="space-y-2">
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground">
              Keep your professional details up to date.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Update the information patients see when they review your profile and choose an
              appointment.
            </p>
          </div>
        </div>
      </div>

      {profileQuery.isLoading ? (
        <StatePanel description="Loading your profile details." loading title="Loading profile" />
      ) : profileQuery.isError ? (
        <StatePanel
          description="We could not load your profile right now. Please try again."
          icon={AlertCircle}
          title="Profile unavailable"
          tone="error"
        >
          <Button onClick={() => profileQuery.refetch()} type="button" variant="outline">
            Try again
          </Button>
        </StatePanel>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>Edit profile</CardTitle>
              <CardDescription>
                This information is used across appointment booking and doctor listings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4"
                onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <ProfileField error={form.formState.errors.firstName?.message} label="First name">
                    <Input autoComplete="given-name" {...form.register('firstName')} />
                  </ProfileField>
                  <ProfileField error={form.formState.errors.lastName?.message} label="Last name">
                    <Input autoComplete="family-name" {...form.register('lastName')} />
                  </ProfileField>
                </div>

                <ProfileField error={form.formState.errors.email?.message} label="Email">
                  <Input autoComplete="email" {...form.register('email')} />
                </ProfileField>

                <div className="grid gap-4 md:grid-cols-2">
                  <ProfileField
                    error={form.formState.errors.specialization?.message}
                    label="Specialization"
                  >
                    <Input placeholder="Cardiology" {...form.register('specialization')} />
                  </ProfileField>
                  <ProfileField
                    error={form.formState.errors.phoneNumber?.message}
                    label="Phone number"
                  >
                    <Input autoComplete="tel" {...form.register('phoneNumber')} />
                  </ProfileField>
                </div>

                <ProfileField error={form.formState.errors.bio?.message} label="Profile summary">
                  <Textarea
                    placeholder="Share a short introduction for patients."
                    {...form.register('bio')}
                  />
                </ProfileField>

                <div className="flex flex-wrap gap-3">
                  <Button disabled={updateMutation.isPending} size="lg" type="submit">
                    {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                  </Button>
                  <Button
                    onClick={() => {
                      if (!profileQuery.data) {
                        return
                      }

                      form.reset({
                        firstName: profileQuery.data.firstName,
                        lastName: profileQuery.data.lastName,
                        email: profileQuery.data.email,
                        specialization: profileQuery.data.specialization,
                        phoneNumber: profileQuery.data.phoneNumber ?? '',
                        bio: profileQuery.data.bio ?? '',
                      })
                    }}
                    type="button"
                    variant="outline"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle>Current details</CardTitle>
                <CardDescription>
                  A quick summary of the information currently on your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.5rem] bg-muted/70 px-4 py-4">
                  <p className="font-serif text-3xl text-foreground">
                    {profileQuery.data?.firstName} {profileQuery.data?.lastName}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {profileQuery.data?.specialization}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-[1.4rem] bg-card px-4 py-3 ring-1 ring-border">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">{profileQuery.data?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-[1.4rem] bg-card px-4 py-3 ring-1 ring-border">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {profileQuery.data?.phoneNumber || 'No phone number added'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-[1.4rem] bg-card px-4 py-3 ring-1 ring-border">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {profileQuery.data?.specialization}
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] bg-muted/70 px-4 py-4">
                  <p className="text-sm font-semibold text-foreground">About this doctor</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {profileQuery.data?.bio?.trim() || 'No profile summary has been added yet.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

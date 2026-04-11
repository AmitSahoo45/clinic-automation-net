import { useDeferredValue, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Search, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getDoctors } from '@/features/patient/patient-api'
import { cn } from '@/lib/utils'

export function PatientDoctorsPage() {
  const [specializationInput, setSpecializationInput] = useState('')
  const deferredSpecialization = useDeferredValue(specializationInput.trim())

  const doctorsQuery = useQuery({
    queryKey: ['patient', 'doctors', deferredSpecialization],
    queryFn: () => getDoctors(deferredSpecialization || undefined),
  })

  const doctors = doctorsQuery.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_18px_60px_rgba(22,56,54,0.08)] md:p-7 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <Badge variant="patient">Find a doctor</Badge>
          <div className="space-y-2">
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground">
              Browse doctors and choose the right appointment.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Search by specialization, review profiles, and continue to live appointment times when
              you are ready to book.
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-xl flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              onChange={(event) => setSpecializationInput(event.target.value)}
              placeholder="Search by specialization"
              value={specializationInput}
            />
          </div>
          <Button onClick={() => setSpecializationInput('')} type="button" variant="outline">
            Clear
          </Button>
        </div>
      </div>

      {doctorsQuery.isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <Card className="border-border/80" key={item}>
              <CardContent className="space-y-4 p-6">
                <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
                <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-muted" />
                <div className="h-20 animate-pulse rounded-2xl bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : doctorsQuery.isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-sm leading-7 text-red-700">
            We could not load the doctor directory right now. Please try again in a moment.
          </CardContent>
        </Card>
      ) : doctors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="font-serif text-3xl text-foreground">No doctors matched that search.</p>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                Try a broader specialty name or clear the filter to view all available doctors.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {doctors.map((doctor) => (
            <Card className="border-border/80" key={doctor.id}>
              <CardHeader className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline">{doctor.specialization}</Badge>
                  <CardTitle>{`${doctor.firstName} ${doctor.lastName}`}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-7">
                  {doctor.bio?.trim()
                    ? doctor.bio
                    : 'Appointments available through the clinic portal.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {doctor.phoneNumber ? (
                    <div className="rounded-full bg-muted px-3 py-1.5">{doctor.phoneNumber}</div>
                  ) : null}
                  <div className="rounded-full bg-muted px-3 py-1.5">{doctor.specialization}</div>
                </div>

                <Link
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full justify-center')}
                  to={`/patient/doctors/${doctor.id}`}
                >
                  View availability
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

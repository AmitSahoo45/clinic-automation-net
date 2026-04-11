import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarClock, CircleCheckBig, NotebookPen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent } from '@/components/ui/card'
import { cancelAppointment, getPatientAppointments } from '@/features/patient/patient-api'
import { getErrorMessage } from '@/lib/api/api-error'
import {
  formatDisplayDate,
  formatDisplayDateTime,
  formatDisplayTimeRange,
  type AppointmentStatus,
} from '@/lib/formatters'
import { cn } from '@/lib/utils'

function getStatusBadge(status: AppointmentStatus) {
  switch (status) {
    case 'Confirmed':
      return { className: 'bg-emerald-100 text-emerald-800', label: 'Confirmed' }
    case 'Cancelled':
      return { className: 'bg-rose-100 text-rose-800', label: 'Cancelled' }
    case 'Completed':
      return { className: 'bg-slate-200 text-slate-800', label: 'Completed' }
    default:
      return { className: 'bg-amber-100 text-amber-800', label: 'Pending' }
  }
}

export function PatientAppointmentsPage() {
  const queryClient = useQueryClient()

  const appointmentsQuery = useQuery({
    queryKey: ['patient', 'appointments'],
    queryFn: getPatientAppointments,
  })

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) => cancelAppointment(appointmentId),
    onSuccess: async () => {
      toast.success('The appointment has been cancelled.')
      await queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] })
      await queryClient.invalidateQueries({ queryKey: ['patient', 'available-slots'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not cancel this appointment.'))
    },
  })

  const appointments = appointmentsQuery.data ?? []
  const activeAppointments = appointments.filter((item) => item.status !== 'Cancelled')
  const cancelledAppointments = appointments.filter((item) => item.status === 'Cancelled')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_18px_60px_rgba(22,56,54,0.08)] md:p-7 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <Badge variant="patient">My appointments</Badge>
          <div className="space-y-2">
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground">
              Keep track of upcoming visits and past bookings.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Review scheduled appointments, revisit notes, and cancel a booking if your plans change.
            </p>
          </div>
        </div>

        <Link className={cn(buttonVariants({ size: 'lg' }))} to="/patient/doctors">
          Book another appointment
        </Link>
      </div>

      {appointmentsQuery.isLoading ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            Loading your appointments...
          </CardContent>
        </Card>
      ) : appointmentsQuery.isError ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-sm leading-7 text-red-700">
            We could not load your appointments right now. Please try again.
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <p className="font-serif text-3xl text-foreground">No appointments yet</p>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                When you book a doctor visit, it will appear here for easy reference.
              </p>
            </div>
            <Link className={cn(buttonVariants())} to="/patient/doctors">
              Browse doctors
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {activeAppointments.length > 0 ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CircleCheckBig className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground">Scheduled and completed visits</p>
              </div>

              <div className="grid gap-4">
                {activeAppointments.map((appointment) => {
                  const statusBadge = getStatusBadge(appointment.status)

                  return (
                    <Card className="border-border/80" key={appointment.id}>
                      <CardContent className="space-y-4 p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <Badge className={statusBadge.className} variant="outline">
                              {statusBadge.label}
                            </Badge>
                            <p className="font-serif text-3xl text-foreground">{appointment.doctorName}</p>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {formatDisplayDate(appointment.slotDate)} •{' '}
                              {formatDisplayTimeRange(appointment.startTime, appointment.endTime)}
                            </p>
                          </div>

                          <Button
                            disabled={
                              appointment.status === 'Cancelled' ||
                              appointment.status === 'Completed' ||
                              cancelMutation.isPending
                            }
                            onClick={() => cancelMutation.mutate(appointment.id)}
                            type="button"
                            variant="outline"
                          >
                            Cancel appointment
                          </Button>
                        </div>

                        {appointment.notes ? (
                          <div className="rounded-[1.4rem] bg-muted/70 px-4 py-4">
                            <div className="flex items-center gap-2">
                              <NotebookPen className="h-4 w-4 text-primary" />
                              <p className="text-sm font-semibold text-foreground">Notes</p>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-muted-foreground">
                              {appointment.notes}
                            </p>
                          </div>
                        ) : null}

                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                          Booked on {formatDisplayDateTime(appointment.bookedAtUtc)}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          ) : null}

          {cancelledAppointments.length > 0 ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-foreground">Cancelled appointments</p>
              </div>

              <div className="grid gap-4">
                {cancelledAppointments.map((appointment) => {
                  const statusBadge = getStatusBadge(appointment.status)

                  return (
                    <Card className="border-border/70 bg-card/70" key={appointment.id}>
                      <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <Badge className={statusBadge.className} variant="outline">
                            {statusBadge.label}
                          </Badge>
                          <p className="font-semibold text-foreground">{appointment.doctorName}</p>
                          <p className="text-sm leading-7 text-muted-foreground">
                            {formatDisplayDate(appointment.slotDate)} •{' '}
                            {formatDisplayTimeRange(appointment.startTime, appointment.endTime)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}

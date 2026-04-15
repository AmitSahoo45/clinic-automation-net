import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, CalendarClock, CircleCheckBig, NotebookPen, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { StatePanel } from '@/components/app/state-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  cancelDoctorAppointment,
  completeDoctorAppointment,
  getDoctorAppointments,
} from '@/features/doctor/doctor-api'
import { getErrorMessage } from '@/lib/api/api-error'
import {
  formatAppointmentSummary,
  formatDisplayDateTime,
  type AppointmentStatus,
} from '@/lib/formatters'

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

export function DoctorAppointmentsPage() {
  const queryClient = useQueryClient()

  const appointmentsQuery = useQuery({
    queryKey: ['doctor', 'appointments'],
    queryFn: getDoctorAppointments,
  })

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) => cancelDoctorAppointment(appointmentId),
    onSuccess: async () => {
      toast.success('The appointment has been cancelled.')
      await queryClient.invalidateQueries({ queryKey: ['doctor', 'appointments'] })
      await queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] })
      await queryClient.invalidateQueries({ queryKey: ['patient', 'available-slots'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not cancel this appointment.'))
    },
  })

  const completeMutation = useMutation({
    mutationFn: (appointmentId: string) => completeDoctorAppointment(appointmentId),
    onSuccess: async () => {
      toast.success('The appointment has been marked as completed.')
      await queryClient.invalidateQueries({ queryKey: ['doctor', 'appointments'] })
      await queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not mark this appointment as completed.'))
    },
  })

  const appointments = appointmentsQuery.data ?? []
  const activeAppointments = appointments.filter((item) => item.status !== 'Cancelled')
  const cancelledAppointments = appointments.filter((item) => item.status === 'Cancelled')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_18px_60px_rgba(22,56,54,0.08)] md:p-7">
        <div className="space-y-3">
          <Badge variant="doctor">Appointments</Badge>
          <div className="space-y-2">
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground">
              Review your upcoming patient visits.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              See scheduled appointments, review notes, and cancel a visit when plans need to change.
            </p>
          </div>
        </div>
      </div>

      {appointmentsQuery.isLoading ? (
        <StatePanel description="Loading your upcoming and past appointments." loading title="Loading appointments" />
      ) : appointmentsQuery.isError ? (
        <StatePanel
          description="We could not load appointments right now. Please try again."
          icon={AlertCircle}
          title="Appointments unavailable"
          tone="error"
        >
          <Button onClick={() => appointmentsQuery.refetch()} type="button" variant="outline">
            Try again
          </Button>
        </StatePanel>
      ) : appointments.length === 0 ? (
        <StatePanel
          description="Patient bookings will appear here once appointment times are reserved."
          icon={CalendarClock}
          title="No appointments scheduled"
        />
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
                            <p className="font-serif text-3xl text-foreground">{appointment.patientName}</p>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {formatAppointmentSummary(
                                appointment.slotDate,
                                appointment.startTime,
                                appointment.endTime,
                              )}
                            </p>
                          </div>

                          <Button
                            disabled={
                              appointment.status === 'Cancelled' ||
                              appointment.status === 'Completed' ||
                              completeMutation.isPending
                            }
                            onClick={() => completeMutation.mutate(appointment.id)}
                            type="button"
                            variant="outline"
                          >
                            Mark as completed
                          </Button>
                          <Button
                            disabled={
                              appointment.status === 'Cancelled' ||
                              appointment.status === 'Completed' ||
                              cancelMutation.isPending ||
                              completeMutation.isPending
                            }
                            onClick={() => cancelMutation.mutate(appointment.id)}
                            type="button"
                            variant="outline"
                          >
                            Cancel appointment
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 rounded-[1.4rem] bg-muted/70 px-4 py-3">
                          <UserRound className="h-4 w-4 text-primary" />
                          <p className="text-sm text-foreground">
                            Patient: <span className="font-semibold">{appointment.patientName}</span>
                          </p>
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
                          <p className="font-semibold text-foreground">{appointment.patientName}</p>
                          <p className="text-sm leading-7 text-muted-foreground">
                            {formatAppointmentSummary(
                              appointment.slotDate,
                              appointment.startTime,
                              appointment.endTime,
                            )}
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

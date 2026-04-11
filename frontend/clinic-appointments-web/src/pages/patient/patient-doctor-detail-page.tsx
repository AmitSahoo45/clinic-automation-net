import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, Clock3, NotebookPen, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { bookAppointment, getAvailableSlots, getDoctorById } from '@/features/patient/patient-api'
import { getErrorMessage } from '@/lib/api/api-error'
import {
  formatCalendarDate,
  formatDisplayDate,
  formatDisplayTimeRange,
  getTodayIsoDate,
} from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function PatientDoctorDetailPage() {
  const { doctorId } = useParams<{ doctorId: string }>()
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(getTodayIsoDate())
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  const doctorQuery = useQuery({
    queryKey: ['patient', 'doctor', doctorId],
    queryFn: () => getDoctorById(doctorId!),
    enabled: Boolean(doctorId),
  })

  const slotsQuery = useQuery({
    queryKey: ['patient', 'available-slots', doctorId, selectedDate],
    queryFn: () => getAvailableSlots(doctorId!, selectedDate),
    enabled: Boolean(doctorId && selectedDate),
  })

  const bookingMutation = useMutation({
    mutationFn: () => {
      if (!selectedTimeSlotId) {
        throw new Error('Please select an appointment time first.')
      }

      return bookAppointment(selectedTimeSlotId, notes)
    },
    onSuccess: async () => {
      toast.success('Your appointment has been booked.')
      setSelectedTimeSlotId(null)
      setNotes('')
      await queryClient.invalidateQueries({ queryKey: ['patient', 'appointments'] })
      await queryClient.invalidateQueries({ queryKey: ['patient', 'available-slots', doctorId] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not complete the booking.'))
    },
  })

  const doctor = doctorQuery.data
  const slots = slotsQuery.data ?? []
  const selectedSlot = slots.find((slot) => slot.id === selectedTimeSlotId) ?? null

  if (doctorQuery.isLoading) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          Loading doctor details...
        </CardContent>
      </Card>
    )
  }

  if (doctorQuery.isError || !doctor) {
    return (
      <Card>
        <CardContent className="space-y-4 p-10 text-center">
          <p className="font-serif text-3xl text-foreground">Doctor not found</p>
          <p className="text-sm leading-7 text-muted-foreground">
            The doctor profile you requested is not available right now.
          </p>
          <Link className={cn(buttonVariants({ variant: 'outline' }))} to="/patient/doctors">
            Back to directory
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        className={cn(buttonVariants({ variant: 'ghost' }), 'self-start rounded-full')}
        to="/patient/doctors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to directory
      </Link>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <Card className="border-border/80">
          <CardHeader className="space-y-4">
            <div className="space-y-3">
              <Badge variant="patient">{doctor.specialization}</Badge>
              <div className="space-y-2">
                <CardTitle className="text-4xl">{`${doctor.firstName} ${doctor.lastName}`}</CardTitle>
                <CardDescription className="max-w-3xl text-base leading-7">
                  {doctor.bio?.trim()
                    ? doctor.bio
                    : 'Appointments are available through the clinic portal.'}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="rounded-full bg-muted px-3 py-1.5">{doctor.specialization}</div>
              {doctor.phoneNumber ? (
                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {doctor.phoneNumber}
                </div>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground" htmlFor="appointment-date">
                  Select a date
                </label>
                <Input
                  id="appointment-date"
                  onChange={(event) => {
                    setSelectedDate(event.target.value)
                    setSelectedTimeSlotId(null)
                  }}
                  type="date"
                  value={selectedDate}
                />
              </div>

              <div className="rounded-[1.6rem] bg-muted/70 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Selected day</p>
                <p className="mt-2 font-serif text-2xl text-foreground">
                  {formatCalendarDate(selectedDate)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Choose one of the available appointment times below to continue.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">Available times</p>
              </div>

              {slotsQuery.isLoading ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div className="h-20 animate-pulse rounded-[1.4rem] bg-muted" key={item} />
                  ))}
                </div>
              ) : slotsQuery.isError ? (
                <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-700">
                  We could not load appointment times for this date. Please try again.
                </div>
              ) : slots.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-border bg-card/70 px-5 py-8 text-center">
                  <p className="font-semibold text-foreground">No appointment times available</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Try a different date to see more appointment options.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      className={cn(
                        'rounded-[1.5rem] border px-4 py-4 text-left transition-all',
                        selectedTimeSlotId === slot.id
                          ? 'border-primary bg-primary text-primary-foreground shadow-[0_18px_42px_rgba(42,157,143,0.18)]'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-accent/40',
                      )}
                      key={slot.id}
                      onClick={() => setSelectedTimeSlotId(slot.id)}
                      type="button"
                    >
                      <div className="text-xs uppercase tracking-[0.22em] opacity-80">
                        {formatDisplayDate(slot.slotDate)}
                      </div>
                      <div className="mt-2 font-semibold">
                        {formatDisplayTimeRange(slot.startTime, slot.endTime)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/80">
            <CardHeader>
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-primary" />
                <CardTitle>Confirm your appointment</CardTitle>
              </div>
              <CardDescription>
                Add an optional note for the clinic and confirm your selected time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.5rem] bg-muted/70 px-4 py-4">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Selected time</p>
                <p className="mt-2 font-semibold text-foreground">
                  {selectedSlot
                    ? formatDisplayTimeRange(selectedSlot.startTime, selectedSlot.endTime)
                    : 'Choose a time'}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selectedSlot
                    ? `Date: ${formatCalendarDate(selectedDate)}`
                    : 'Select a slot from the list to continue.'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground" htmlFor="appointment-notes">
                  Note for the clinic
                </label>
                <Textarea
                  id="appointment-notes"
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional note about your visit"
                  value={notes}
                />
              </div>

              <Button
                className="w-full"
                disabled={!selectedTimeSlotId || bookingMutation.isPending}
                onClick={() => bookingMutation.mutate()}
                size="lg"
                type="button"
              >
                {bookingMutation.isPending ? 'Booking appointment...' : 'Book appointment'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground">Need to review your bookings?</p>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                You can check upcoming visits, review notes, or cancel an appointment from your
                appointments page at any time.
              </p>
              <Link
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-center')}
                to="/patient/appointments"
              >
                Go to my appointments
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

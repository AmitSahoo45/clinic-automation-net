import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addDays, format, parseISO, startOfWeek } from 'date-fns'
import { AlertCircle, CalendarDays, Clock3, PencilLine, Trash2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { StatePanel } from '@/components/app/state-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  createDoctorSchedule,
  deleteDoctorSchedule,
  getDoctorSchedules,
  type DoctorScheduleItem,
  updateDoctorSchedule,
} from '@/features/doctor/doctor-api'
import {
  type DoctorScheduleValues,
  doctorScheduleSchema,
} from '@/features/doctor/doctor-schemas'
import { getErrorMessage } from '@/lib/api/api-error'
import { formatDisplayTimeRange, getTodayIsoDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const dayOptions = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
] as const

function normalizeToWeekStart(dateValue: string) {
  return format(startOfWeek(parseISO(dateValue), { weekStartsOn: 1 }), 'yyyy-MM-dd')
}

function getCurrentWeekStart() {
  return normalizeToWeekStart(getTodayIsoDate())
}

function getScheduleDate(weekStartDate: string, dayOfWeek: number) {
  return addDays(parseISO(weekStartDate), dayOfWeek - 1)
}

function formatWeekRange(weekStartDate: string) {
  const weekStart = parseISO(weekStartDate)
  const weekEnd = addDays(weekStart, 6)
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
}

function formatScheduleDateLabel(weekStartDate: string, dayOfWeek: number) {
  return format(getScheduleDate(weekStartDate, dayOfWeek), 'EEEE, MMM d, yyyy')
}

function formatScheduleDateShort(weekStartDate: string, dayOfWeek: number) {
  return format(getScheduleDate(weekStartDate, dayOfWeek), 'MMMM d, yyyy')
}

function ScheduleField({
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

function getDefaultScheduleValues(weekStartDate: string): DoctorScheduleValues {
  return {
    weekStartDate,
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '12:00',
    isAvailable: true,
  }
}

export function DoctorSchedulesPage() {
  const queryClient = useQueryClient()
  const [selectedWeekStart, setSelectedWeekStart] = useState(getCurrentWeekStart())
  const [editingSchedule, setEditingSchedule] = useState<DoctorScheduleItem | null>(null)

  const form = useForm<DoctorScheduleValues>({
    defaultValues: getDefaultScheduleValues(selectedWeekStart),
    resolver: zodResolver(doctorScheduleSchema),
  })

  const schedulesQuery = useQuery({
    queryKey: ['doctor', 'schedules', selectedWeekStart],
    queryFn: () => getDoctorSchedules(selectedWeekStart),
  })

  useEffect(() => {
    if (editingSchedule) {
      form.reset({
        weekStartDate: editingSchedule.weekStartDate,
        dayOfWeek: editingSchedule.dayOfWeek,
        startTime: editingSchedule.startTime.slice(0, 5),
        endTime: editingSchedule.endTime.slice(0, 5),
        isAvailable: editingSchedule.isAvailable,
      })
      return
    }

    form.reset(getDefaultScheduleValues(selectedWeekStart))
  }, [editingSchedule, form, selectedWeekStart])

  const createMutation = useMutation({
    mutationFn: (values: DoctorScheduleValues) => createDoctorSchedule(values),
    onSuccess: async () => {
      toast.success('Schedule entry added.')
      form.reset(getDefaultScheduleValues(selectedWeekStart))
      await queryClient.invalidateQueries({ queryKey: ['doctor', 'schedules', selectedWeekStart] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not add that schedule entry.'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: (values: DoctorScheduleValues) => {
      if (!editingSchedule) {
        throw new Error('Choose a schedule entry to edit first.')
      }

      return updateDoctorSchedule(editingSchedule.id, values)
    },
    onSuccess: async () => {
      toast.success('Schedule entry updated.')
      setEditingSchedule(null)
      form.reset(getDefaultScheduleValues(selectedWeekStart))
      await queryClient.invalidateQueries({ queryKey: ['doctor', 'schedules', selectedWeekStart] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not update that schedule entry.'))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (scheduleId: string) => deleteDoctorSchedule(scheduleId),
    onSuccess: async (_, scheduleId) => {
      toast.success('Schedule entry removed.')
      if (editingSchedule?.id === scheduleId) {
        setEditingSchedule(null)
      }
      await queryClient.invalidateQueries({ queryKey: ['doctor', 'schedules', selectedWeekStart] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'We could not remove that schedule entry.'))
    },
  })

  const schedules = schedulesQuery.data ?? []
  const sortedSchedules = [...schedules].sort((left, right) => left.dayOfWeek - right.dayOfWeek)
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const selectedDay = useWatch({ control: form.control, name: 'dayOfWeek' })
  const selectedFormWeek = useWatch({ control: form.control, name: 'weekStartDate' }) || selectedWeekStart

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-border/80 bg-card/80 p-6 shadow-[0_18px_60px_rgba(22,56,54,0.08)] md:p-7 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <Badge variant="doctor">Weekly availability</Badge>
          <div className="space-y-2">
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground">
              Set appointment hours for {formatWeekRange(selectedWeekStart)}.
            </h2>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              Choose the week once, then add the days and times you want to open for appointments.
            </p>
          </div>
        </div>

        <div className="w-full max-w-[260px] space-y-2">
          <label className="text-sm font-semibold text-foreground" htmlFor="week-start">
            Select week
          </label>
          <Input
            id="week-start"
            onChange={(event) => {
              const normalized = normalizeToWeekStart(event.target.value)
              setSelectedWeekStart(normalized)
              setEditingSchedule(null)
            }}
            type="date"
            value={selectedWeekStart}
          />
          <p className="text-xs leading-5 text-muted-foreground">
            The calendar below is organized automatically from Monday to Sunday.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <Card className="border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>{editingSchedule ? 'Edit appointment hours' : 'Add appointment hours'}</CardTitle>
                <CardDescription>
                  Choose the day and time you want to make available in the selected week.
                </CardDescription>
              </div>
              {editingSchedule ? (
                <Button
                  onClick={() => setEditingSchedule(null)}
                  type="button"
                  variant="outline"
                >
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit((values) => {
                if (editingSchedule) {
                  updateMutation.mutate(values)
                  return
                }

                createMutation.mutate(values)
              })}
            >
              <input type="hidden" {...form.register('weekStartDate')} />

              <div className="rounded-[1.5rem] bg-muted/70 px-4 py-4">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Selected date</p>
                <p className="mt-2 font-serif text-2xl text-foreground">
                  {formatScheduleDateLabel(selectedFormWeek, selectedDay || 1)}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Appointments booked on this day will appear under the selected week.
                </p>
              </div>

              <ScheduleField error={form.formState.errors.dayOfWeek?.message} label="Day">
                <select
                  className={cn(
                    'flex h-11 w-full rounded-2xl border border-input bg-card px-4 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                  {...form.register('dayOfWeek', { valueAsNumber: true })}
                >
                  {dayOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </ScheduleField>

              <div className="grid gap-4 md:grid-cols-2">
                <ScheduleField error={form.formState.errors.startTime?.message} label="Start time">
                  <Input type="time" {...form.register('startTime')} />
                </ScheduleField>

                <ScheduleField error={form.formState.errors.endTime?.message} label="End time">
                  <Input type="time" {...form.register('endTime')} />
                </ScheduleField>
              </div>

              <label className="flex items-center gap-3 rounded-[1.4rem] bg-muted/70 px-4 py-3">
                <input className="h-4 w-4" type="checkbox" {...form.register('isAvailable')} />
                <span className="text-sm font-medium text-foreground">Available for booking</span>
              </label>

              <div className="flex flex-wrap gap-3">
                <Button disabled={isSubmitting} size="lg" type="submit">
                  {editingSchedule
                    ? updateMutation.isPending
                      ? 'Saving changes...'
                      : 'Update entry'
                    : createMutation.isPending
                      ? 'Adding entry...'
                      : 'Add entry'}
                </Button>
                <Button
                  onClick={() => {
                    setEditingSchedule(null)
                    form.reset(getDefaultScheduleValues(selectedWeekStart))
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

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle>{formatWeekRange(selectedWeekStart)}</CardTitle>
            <CardDescription>Appointment hours for the selected week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedulesQuery.isLoading ? (
              <StatePanel
                className="shadow-none"
                description="Loading schedule entries for the selected week."
                loading
                title="Loading schedule"
              />
            ) : schedulesQuery.isError ? (
              <StatePanel
                className="shadow-none"
                description="We could not load this week's schedule. Please try again."
                icon={AlertCircle}
                title="Schedule unavailable"
                tone="error"
              >
                <Button onClick={() => schedulesQuery.refetch()} type="button" variant="outline">
                  Try again
                </Button>
              </StatePanel>
            ) : schedules.length === 0 ? (
              <StatePanel
                className="shadow-none"
                description="Add one or more entries to open appointments for this week."
                icon={CalendarDays}
                title="No schedule entries for this week"
              />
            ) : (
              sortedSchedules.map((schedule) => (
                <div
                  className="rounded-[1.6rem] border border-border/80 bg-card px-5 py-5 shadow-[0_14px_32px_rgba(22,56,54,0.06)]"
                  key={schedule.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={schedule.isAvailable ? 'doctor' : 'outline'}>
                          {dayOptions.find((item) => item.value === schedule.dayOfWeek)?.label}
                        </Badge>
                        <Badge variant="outline">
                          {schedule.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="font-serif text-2xl text-foreground">
                          {formatDisplayTimeRange(schedule.startTime, schedule.endTime)}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock3 className="h-4 w-4" />
                          <span>{formatScheduleDateShort(schedule.weekStartDate, schedule.dayOfWeek)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => setEditingSchedule(schedule)}
                        type="button"
                        variant="outline"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(schedule.id)}
                        type="button"
                        variant="outline"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="rounded-[1.5rem] bg-muted/70 px-4 py-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground">How scheduling works</p>
              </div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Select the week once, then add one availability entry for each day you want to open.
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                If you shorten hours or remove a day, any appointments outside the updated time range
                are cancelled automatically.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

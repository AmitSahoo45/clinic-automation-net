import { format, parse, parseISO } from 'date-fns'

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'

export function getTodayIsoDate() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDisplayDate(value: string) {
  return format(parseISO(value), 'EEE, MMM d, yyyy')
}

export function formatCalendarDate(value: string) {
  return format(parseISO(value), 'MMMM d, yyyy')
}

export function formatDisplayTime(value: string) {
  return format(parse(value, 'HH:mm:ss', new Date()), 'h:mm a')
}

export function formatDisplayDateTime(value: string) {
  return format(parseISO(value), 'MMM d, yyyy • h:mm a')
}

export function formatDisplayTimeRange(startTime: string, endTime: string) {
  return `${formatDisplayTime(startTime)} - ${formatDisplayTime(endTime)}`
}

export function normalizeAppointmentStatus(value: number | string): AppointmentStatus {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'pending') return 'Pending'
    if (normalized === 'confirmed') return 'Confirmed'
    if (normalized === 'cancelled') return 'Cancelled'
    if (normalized === 'completed') return 'Completed'
  }

  if (value === 1) return 'Pending'
  if (value === 2) return 'Confirmed'
  if (value === 3) return 'Cancelled'
  if (value === 4) return 'Completed'

  return 'Pending'
}

import { apiClient } from '@/lib/api/api-client'
import { normalizeAppointmentStatus, type AppointmentStatus } from '@/lib/formatters'

export type DoctorProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  specialization: string
  phoneNumber?: string | null
  bio?: string | null
}

export type DoctorScheduleItem = {
  id: string
  doctorId: string
  weekStartDate: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

export type DoctorAppointmentItem = {
  id: string
  doctorId: string
  doctorName: string
  patientId: string
  patientName: string
  timeSlotId: string
  slotDate: string
  startTime: string
  endTime: string
  status: AppointmentStatus
  bookedAtUtc: string
  notes?: string | null
}

export type DoctorProfileInput = {
  firstName: string
  lastName: string
  email: string
  specialization: string
  phoneNumber?: string
  bio?: string
}

export type DoctorScheduleInput = {
  weekStartDate: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function readString(record: UnknownRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string') {
      return value
    }
  }

  return ''
}

function readNullableString(record: UnknownRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string') {
      return value
    }
    if (value === null) {
      return null
    }
  }

  return null
}

function readNumber(record: UnknownRecord, fallback: number, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value)
      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }
  }

  return fallback
}

function parseDoctorProfile(record: UnknownRecord): DoctorProfile {
  return {
    id: readString(record, 'id', 'Id'),
    firstName: readString(record, 'firstName', 'FirstName'),
    lastName: readString(record, 'lastName', 'LastName'),
    email: readString(record, 'email', 'Email'),
    specialization: readString(record, 'specialization', 'Specialization'),
    phoneNumber: readNullableString(record, 'phoneNumber', 'PhoneNumber'),
    bio: readNullableString(record, 'bio', 'Bio'),
  }
}

function parseDoctorSchedule(record: UnknownRecord): DoctorScheduleItem {
  return {
    id: readString(record, 'id', 'Id'),
    doctorId: readString(record, 'doctorId', 'DoctorId'),
    weekStartDate: readString(record, 'weekStartDate', 'WeekStartDate'),
    dayOfWeek: readNumber(record, 1, 'dayOfWeek', 'DayOfWeek'),
    startTime: readString(record, 'startTime', 'StartTime'),
    endTime: readString(record, 'endTime', 'EndTime'),
    isAvailable: Boolean(record.isAvailable ?? record.IsAvailable),
  }
}

function parseDoctorAppointment(record: UnknownRecord): DoctorAppointmentItem {
  return {
    id: readString(record, 'id', 'Id'),
    doctorId: readString(record, 'doctorId', 'DoctorId'),
    doctorName: readString(record, 'doctorName', 'DoctorName'),
    patientId: readString(record, 'patientId', 'PatientId'),
    patientName: readString(record, 'patientName', 'PatientName'),
    timeSlotId: readString(record, 'timeSlotId', 'TimeSlotId'),
    slotDate: readString(record, 'slotDate', 'SlotDate'),
    startTime: readString(record, 'startTime', 'StartTime'),
    endTime: readString(record, 'endTime', 'EndTime'),
    status: normalizeAppointmentStatus(readNumber(record, 1, 'status', 'Status')),
    bookedAtUtc: readString(record, 'bookedAtUtc', 'BookedAtUtc'),
    notes: readNullableString(record, 'notes', 'Notes'),
  }
}

function toSecondsTime(value: string) {
  if (!value.trim()) {
    return value
  }

  return value.length === 5 ? `${value}:00` : value
}

export async function getDoctorProfile() {
  const payload = await apiClient<unknown>('/doctors/me')
  if (!isRecord(payload)) {
    throw new Error('The doctor profile response was not in the expected format.')
  }

  return parseDoctorProfile(payload)
}

export async function updateDoctorProfile(input: DoctorProfileInput) {
  const payload = await apiClient<unknown>('/doctors/me', {
    method: 'PUT',
    body: {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      specialization: input.specialization.trim(),
      phoneNumber: input.phoneNumber?.trim() || null,
      bio: input.bio?.trim() || null,
    },
  })

  if (!isRecord(payload)) {
    throw new Error('The updated doctor profile response was not in the expected format.')
  }

  return parseDoctorProfile(payload)
}

export async function getDoctorSchedules(weekStartDate?: string) {
  const query = weekStartDate ? `?weekStartDate=${encodeURIComponent(weekStartDate)}` : ''
  const payload = await apiClient<unknown>(`/doctors/schedules${query}`)
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.filter(isRecord).map(parseDoctorSchedule)
}

export async function createDoctorSchedule(input: DoctorScheduleInput) {
  const payload = await apiClient<unknown>('/doctors/schedules', {
    method: 'POST',
    body: {
      weekStartDate: input.weekStartDate,
      dayOfWeek: input.dayOfWeek,
      startTime: toSecondsTime(input.startTime),
      endTime: toSecondsTime(input.endTime),
      isAvailable: input.isAvailable,
    },
  })

  if (!isRecord(payload)) {
    throw new Error('The new schedule response was not in the expected format.')
  }

  return parseDoctorSchedule(payload)
}

export async function updateDoctorSchedule(scheduleId: string, input: DoctorScheduleInput) {
  const payload = await apiClient<unknown>(`/doctors/schedules/${scheduleId}`, {
    method: 'PUT',
    body: {
      weekStartDate: input.weekStartDate,
      dayOfWeek: input.dayOfWeek,
      startTime: toSecondsTime(input.startTime),
      endTime: toSecondsTime(input.endTime),
      isAvailable: input.isAvailable,
    },
  })

  if (!isRecord(payload)) {
    throw new Error('The updated schedule response was not in the expected format.')
  }

  return parseDoctorSchedule(payload)
}

export async function deleteDoctorSchedule(scheduleId: string) {
  await apiClient<void>(`/doctors/schedules/${scheduleId}`, {
    method: 'DELETE',
  })
}

export async function getDoctorAppointments() {
  const payload = await apiClient<unknown>('/appointments/doctor/me')
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.filter(isRecord).map(parseDoctorAppointment)
}

export async function cancelDoctorAppointment(appointmentId: string) {
  const payload = await apiClient<unknown>(`/appointments/${appointmentId}/cancel`, {
    method: 'PUT',
  })

  if (!isRecord(payload)) {
    throw new Error('The cancellation response was not in the expected format.')
  }

  return parseDoctorAppointment(payload)
}

export async function completeDoctorAppointment(appointmentId: string) {
  const payload = await apiClient<unknown>(`/appointments/${appointmentId}/complete`, {
    method: 'PUT',
  })

  if (!isRecord(payload)) {
    throw new Error('The completion response was not in the expected format.')
  }

  return parseDoctorAppointment(payload)
}

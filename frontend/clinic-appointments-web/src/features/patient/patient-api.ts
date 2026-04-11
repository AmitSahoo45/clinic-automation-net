import { apiClient } from '@/lib/api/api-client'
import {
  type AppointmentStatus,
  normalizeAppointmentStatus,
} from '@/lib/formatters'

export type DoctorDirectoryItem = {
  id: string
  firstName: string
  lastName: string
  email: string
  specialization: string
  phoneNumber?: string | null
  bio?: string | null
}

export type TimeSlotItem = {
  id: string
  doctorId: string
  doctorScheduleId: string
  slotDate: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export type AppointmentItem = {
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

function readStatus(record: UnknownRecord, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number' || typeof value === 'string') {
      return value
    }
  }

  return 1
}

function parseDoctors(payload: unknown): DoctorDirectoryItem[] {
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.filter(isRecord).map((item) => ({
    id: readString(item, 'id', 'Id'),
    firstName: readString(item, 'firstName', 'FirstName'),
    lastName: readString(item, 'lastName', 'LastName'),
    email: readString(item, 'email', 'Email'),
    specialization: readString(item, 'specialization', 'Specialization'),
    phoneNumber: readNullableString(item, 'phoneNumber', 'PhoneNumber'),
    bio: readNullableString(item, 'bio', 'Bio'),
  }))
}

function parseTimeSlots(payload: unknown): TimeSlotItem[] {
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.filter(isRecord).map((item) => ({
    id: readString(item, 'id', 'Id'),
    doctorId: readString(item, 'doctorId', 'DoctorId'),
    doctorScheduleId: readString(item, 'doctorScheduleId', 'DoctorScheduleId'),
    slotDate: readString(item, 'slotDate', 'SlotDate'),
    startTime: readString(item, 'startTime', 'StartTime'),
    endTime: readString(item, 'endTime', 'EndTime'),
    isBooked: Boolean(item.isBooked ?? item.IsBooked),
  }))
}

function parseAppointment(record: UnknownRecord): AppointmentItem {
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
    status: normalizeAppointmentStatus(readStatus(record, 'status', 'Status')),
    bookedAtUtc: readString(record, 'bookedAtUtc', 'BookedAtUtc'),
    notes: readNullableString(record, 'notes', 'Notes'),
  }
}

function parseAppointments(payload: unknown): AppointmentItem[] {
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.filter(isRecord).map(parseAppointment)
}

export async function getDoctors(specialization?: string) {
  const query = specialization ? `?specialization=${encodeURIComponent(specialization)}` : ''
  const payload = await apiClient<unknown>(`/doctors${query}`)
  return parseDoctors(payload)
}

export async function getDoctorById(doctorId: string) {
  const doctors = await getDoctors()
  return doctors.find((doctor) => doctor.id === doctorId) ?? null
}

export async function getAvailableSlots(doctorId: string, date: string) {
  const payload = await apiClient<unknown>(
    `/doctors/${doctorId}/available-slots?date=${encodeURIComponent(date)}`,
  )
  return parseTimeSlots(payload)
}

export async function bookAppointment(timeSlotId: string, notes?: string) {
  const payload = await apiClient<unknown>('/appointments', {
    method: 'POST',
    body: {
      timeSlotId,
      notes: notes?.trim() ? notes.trim() : null,
    },
  })

  if (!isRecord(payload)) {
    throw new Error('The booking response was not in the expected format.')
  }

  return parseAppointment(payload)
}

export async function getPatientAppointments() {
  const payload = await apiClient<unknown>('/appointments/patient/me')
  return parseAppointments(payload)
}

export async function cancelAppointment(appointmentId: string) {
  const payload = await apiClient<unknown>(`/appointments/${appointmentId}/cancel`, {
    method: 'PUT',
  })

  if (!isRecord(payload)) {
    throw new Error('The cancellation response was not in the expected format.')
  }

  return parseAppointment(payload)
}

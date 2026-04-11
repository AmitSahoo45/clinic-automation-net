import { z } from 'zod'

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`)

export const doctorProfileSchema = z.object({
  firstName: requiredText('First name'),
  lastName: requiredText('Last name'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  specialization: requiredText('Specialization'),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
})

export const doctorScheduleSchema = z
  .object({
    weekStartDate: z.string().trim().min(1, 'Week start date is required.'),
    dayOfWeek: z.number().int().min(1).max(7),
    startTime: z.string().trim().min(1, 'Start time is required.'),
    endTime: z.string().trim().min(1, 'End time is required.'),
    isAvailable: z.boolean(),
  })
  .refine((value) => value.startTime < value.endTime, {
    message: 'End time must be later than start time.',
    path: ['endTime'],
  })
  .refine((value) => new Date(`${value.weekStartDate}T00:00:00`).getDay() === 1, {
    message: 'Week start date must be a Monday.',
    path: ['weekStartDate'],
  })

export type DoctorProfileValues = z.infer<typeof doctorProfileSchema>
export type DoctorScheduleValues = z.infer<typeof doctorScheduleSchema>

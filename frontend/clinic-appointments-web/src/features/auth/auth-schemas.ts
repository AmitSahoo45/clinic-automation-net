import { z } from 'zod'

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required.`)

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : undefined))
  .optional()

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export const patientRegisterSchema = z.object({
  firstName: requiredText('First name'),
  lastName: requiredText('Last name'),
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  phoneNumber: optionalText,
})

export const doctorRegisterSchema = patientRegisterSchema.extend({
  specialization: requiredText('Specialization'),
  bio: optionalText,
})

export type LoginValues = z.infer<typeof loginSchema>
export type PatientRegisterValues = z.infer<typeof patientRegisterSchema>
export type DoctorRegisterValues = z.infer<typeof doctorRegisterSchema>

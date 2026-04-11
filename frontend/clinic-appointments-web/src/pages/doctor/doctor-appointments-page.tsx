import { FeaturePreview } from '@/components/app/feature-preview'

export function DoctorAppointmentsPage() {
  return (
    <FeaturePreview
      checklist={[
        'Doctor-only route guard is active.',
        'This page will share the same shell and session state as profile and schedules.',
        'Cancellation flows can plug in without changing navigation later.',
      ]}
      description="Appointments are part of the same doctor workspace, so we are anchoring the route now. The actual data table and cancellation actions can arrive as a focused slice."
      endpoints={['GET /api/appointments/doctor/me', 'PUT /api/appointments/{appointmentId}/cancel']}
      eyebrow="doctor appointments"
      title="Doctor appointment review is staged and ready."
      tone="doctor"
    />
  )
}

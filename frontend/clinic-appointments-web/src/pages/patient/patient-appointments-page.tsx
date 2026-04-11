import { FeaturePreview } from '@/components/app/feature-preview'

export function PatientAppointmentsPage() {
  return (
    <FeaturePreview
      checklist={[
        'Patient-only route guard is active.',
        'This page will use the shared session state to scope appointments automatically.',
        'Cancel and refresh flows can plug into React Query cleanly in the next slice.',
      ]}
      description="This route is ready for the patient appointments list and cancellation flow. The protected shell means we can move straight into query and mutation work when we tackle the patient slice."
      endpoints={['GET /api/appointments/patient/me', 'PUT /api/appointments/{appointmentId}/cancel']}
      eyebrow="patient appointments"
      title="Appointment history and cancellations have a protected route now."
      tone="patient"
    />
  )
}

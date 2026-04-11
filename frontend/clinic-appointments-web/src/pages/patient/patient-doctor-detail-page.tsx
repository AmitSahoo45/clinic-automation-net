import { FeaturePreview } from '@/components/app/feature-preview'

export function PatientDoctorDetailPage() {
  return (
    <FeaturePreview
      checklist={[
        'Nested patient routing is already prepared for doctor-specific pages.',
        'Availability queries can connect here without reworking the shell.',
        'Booking mutations can stay in the patient lane with role-safe navigation.',
      ]}
      description="This placeholder route represents the future doctor detail and booking screen. It gives us the right URL shape now so the upcoming patient flow can stay focused on data and interaction design."
      endpoints={[
        'GET /api/doctors',
        'GET /api/doctors/{doctorId}/available-slots',
        'POST /api/appointments',
      ]}
      eyebrow="patient booking"
      title="The book-an-appointment route is mapped already."
      tone="patient"
    />
  )
}

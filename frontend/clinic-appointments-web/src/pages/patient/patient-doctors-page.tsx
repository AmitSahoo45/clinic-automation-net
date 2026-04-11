import { FeaturePreview } from '@/components/app/feature-preview'

export function PatientDoctorsPage() {
  return (
    <FeaturePreview
      checklist={[
        'Patient routes are isolated from doctor routes.',
        'The doctor directory can be layered in without touching auth infrastructure.',
        'Filtering and query state can be added directly in Task 3.',
      ]}
      description="This is the entry point for the patient browsing flow. The route is protected now and ready for doctor search, specialization filtering, and navigation into booking."
      endpoints={['GET /api/doctors', 'GET /api/doctors?specialization=Cardiology']}
      eyebrow="patient directory"
      title="Patients already have a dedicated browse route."
      tone="patient"
    />
  )
}

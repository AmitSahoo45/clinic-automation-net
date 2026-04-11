import { FeaturePreview } from '@/components/app/feature-preview'

export function DoctorProfilePage() {
  return (
    <FeaturePreview
      checklist={[
        'Doctor-only route guard is active already.',
        'This page will hydrate from the signed-in doctor context.',
        'Task 4 can focus directly on form state and data mutations.',
      ]}
      description="This workspace page is now protected and ready for the profile form. Once we reach the doctor slice, it will plug straight into the doctor identity already restored in Task 1."
      endpoints={['GET /api/doctors/me', 'PUT /api/doctors/me']}
      eyebrow="doctor profile"
      title="Doctor profile editing will drop into this route next."
      tone="doctor"
    />
  )
}

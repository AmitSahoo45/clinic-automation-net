import { FeaturePreview } from '@/components/app/feature-preview'

export function DoctorSchedulesPage() {
  return (
    <FeaturePreview
      checklist={[
        'Week-based schedule rules from the backend are already accounted for in the route plan.',
        'Doctor-only navigation and redirects are active here now.',
        'Task 4 can focus on CRUD UI instead of shell work.',
      ]}
      description="This page is the future home for weekly availability management. The route is protected now so schedule CRUD can be added without revisiting the app skeleton."
      endpoints={[
        'GET /api/doctors/schedules',
        'POST /api/doctors/schedules',
        'PUT /api/doctors/schedules/{scheduleId}',
        'DELETE /api/doctors/schedules/{scheduleId}',
      ]}
      eyebrow="doctor schedules"
      title="Schedule management has a protected home now."
      tone="doctor"
    />
  )
}

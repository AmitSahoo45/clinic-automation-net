import { Navigate, createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/components/app/dashboard-layout'
import { PublicLayout } from '@/components/app/public-layout'
import { AuthenticatedRoute } from '@/components/guards/authenticated-route'
import { PublicOnlyRoute } from '@/components/guards/public-only-route'
import { RoleRoute } from '@/components/guards/role-route'
import { RootRedirect } from '@/app/root-redirect'
import { DoctorAppointmentsPage } from '@/pages/doctor/doctor-appointments-page'
import { DoctorProfilePage } from '@/pages/doctor/doctor-profile-page'
import { DoctorSchedulesPage } from '@/pages/doctor/doctor-schedules-page'
import { PatientAppointmentsPage } from '@/pages/patient/patient-appointments-page'
import { PatientDoctorDetailPage } from '@/pages/patient/patient-doctor-detail-page'
import { PatientDoctorsPage } from '@/pages/patient/patient-doctors-page'
import { LoginPage } from '@/pages/public/login-page'
import { RegisterPage } from '@/pages/public/register-page'
import { NotFoundPage } from '@/pages/shared/not-found-page'
import { RouteErrorPage } from '@/pages/shared/route-error-page'

export const appRouter = createBrowserRouter([
  {
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/',
        element: <RootRedirect />,
      },
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            element: <PublicLayout />,
            children: [
              {
                path: '/login',
                element: <LoginPage />,
              },
              {
                path: '/register',
                element: <RegisterPage />,
              },
            ],
          },
        ],
      },
      {
        element: <AuthenticatedRoute />,
        children: [
          {
            path: '/doctor',
            element: <RoleRoute role="Doctor" />,
            children: [
              {
                element: <DashboardLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate replace to="profile" />,
                  },
                  {
                    path: 'profile',
                    element: <DoctorProfilePage />,
                  },
                  {
                    path: 'schedules',
                    element: <DoctorSchedulesPage />,
                  },
                  {
                    path: 'appointments',
                    element: <DoctorAppointmentsPage />,
                  },
                ],
              },
            ],
          },
          {
            path: '/patient',
            element: <RoleRoute role="Patient" />,
            children: [
              {
                element: <DashboardLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate replace to="doctors" />,
                  },
                  {
                    path: 'doctors',
                    element: <PatientDoctorsPage />,
                  },
                  {
                    path: 'doctors/:doctorId',
                    element: <PatientDoctorDetailPage />,
                  },
                  {
                    path: 'appointments',
                    element: <PatientAppointmentsPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

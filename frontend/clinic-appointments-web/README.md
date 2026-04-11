# Clinic Appointments Web

This is the Phase 6 frontend for the Clinic Appointments project. It is a separate `React + Vite + TypeScript` app that lives in the same repository as the .NET backend.

## Current Status

The frontend currently includes:

- doctor and patient sign in and registration
- protected routing with session restore through JWT + `/api/auth/me`
- patient flows for doctor search, availability, booking, and appointment management
- doctor flows for profile management, weekly schedules, and appointment review
- shared loading, empty, error, and fallback states across the app

## Run Locally

1. Start the backend API from Visual Studio or with `dotnet run` from the API project.
2. If you are running the Visual Studio `https` profile, keep the proxy target at `https://localhost:7145`.
3. If you are running the API on a different local URL, copy `.env.example` to `.env.local` and update `VITE_API_PROXY_TARGET`.
4. From this folder, run `npm install` if needed.
5. Start the frontend with `npm run dev`.
6. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Environment

Copy `.env.example` to `.env.local` if you want to override defaults.

- `VITE_APP_NAME`: frontend display name
- `VITE_API_BASE_URL`: API base path used by the browser, defaults to `/api`
- `VITE_API_PROXY_TARGET`: local backend target for the Vite dev proxy, defaults to `https://localhost:7145`

## Current Routes

- `/login`
- `/register`
- `/doctor/profile`
- `/doctor/schedules`
- `/doctor/appointments`
- `/patient/doctors`
- `/patient/doctors/:doctorId`
- `/patient/appointments`

## Suggested Test Flows

Patient flow:
- sign in as a patient
- browse doctors and filter by specialization
- open a doctor profile
- choose a date and book an appointment
- review and cancel the booking from `/patient/appointments`

Doctor flow:
- sign in as a doctor
- update profile details
- add or edit schedule entries for a Monday-start week
- review bookings from `/doctor/appointments`
- cancel an appointment and confirm the slot becomes available again

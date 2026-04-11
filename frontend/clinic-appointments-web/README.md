# Clinic Appointments Web

Phase 6 frontend lives here as a separate `React + Vite + TypeScript` app. It stays in the same repo as the .NET backend, but it is not part of the Visual Studio solution.

## Task 1 Status

Task 1 is implemented:

- Tailwind and shadcn-style UI foundation are wired
- React Router route tree is in place
- TanStack Query and toast providers are configured
- JWT session restore is wired through `localStorage` + `GET /api/auth/me`
- Public, authenticated, doctor-only, and patient-only guards are active
- Shared public and dashboard shells are ready for the next slices

## Run Locally

1. Start the backend API from Visual Studio or with `dotnet run` from the API project.
2. If you are running the Visual Studio `https` profile, the frontend proxy should target `https://localhost:7145`.
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

## Temporary Task 1 Testing

Until Task 2 adds the real login/register forms, you can test session restore by placing a valid JWT from Postman into browser local storage with the key:

```text
clinic-appointments.access-token
```

Then refresh the page. The frontend will call `/api/auth/me` and redirect into the correct role workspace.

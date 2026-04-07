# Clinic Appointments POC

Clinic Appointments is a proof-of-concept web application where:

- Patients can register, browse doctors, view available time slots, and book appointments.
- Doctors can manage their profile, define weekly availability, and view appointments.

The backend is currently set up with ASP.NET Core Web API, Entity Framework Core, and SQL Server.

## Current Status

- Phase 1 is complete.
- The solution, domain entities, DTOs, EF Core `DbContext`, SQL Server wiring, and initial migration are in place.
- The project is currently using `.NET 10` because that is the SDK installed locally on this machine.

## Solution Structure

Open this solution in Visual Studio:

- [ClinicAppointments.sln](/d:/Projects/16-net-poc-ibm/ClinicAppointments.sln)

Projects:

- `src/ClinicAppointments.Api`
  ASP.NET Core Web API startup project.
- `src/ClinicAppointments.Core`
  Domain entities, enums, and DTOs.
- `src/ClinicAppointments.Infrastructure`
  EF Core persistence, configurations, and migrations.
- `src/ClinicAppointments.Services`
  Application/service layer project for upcoming phases.

## Running the API

### In Visual Studio

1. Open `ClinicAppointments.sln`.
2. Set `ClinicAppointments.Api` as the startup project.
3. Press `F5` or `Ctrl+F5`.
4. If prompted to trust the ASP.NET Core SSL certificate, click `Yes` for local development.
5. Browse to:
   - `https://localhost:7145/`
   - or `http://localhost:5235/`

You should see a small JSON response confirming the API is running.

### From the command line

```powershell
dotnet restore ClinicAppointments.sln
dotnet build ClinicAppointments.sln
dotnet run --project src\ClinicAppointments.Api
```

## Database Setup

The API is currently configured to use SQL Server LocalDB via:

- [appsettings.json](/d:/Projects/16-net-poc-ibm/src/ClinicAppointments.Api/appsettings.json)

Default connection string:

```text
Server=(localdb)\MSSQLLocalDB;Database=ClinicAppointmentsDb;Trusted_Connection=True;MultipleActiveResultSets=true;Encrypt=False;TrustServerCertificate=True
```

Initial migration is already created under:

- [Migrations](/d:/Projects/16-net-poc-ibm/src/ClinicAppointments.Infrastructure/Persistence/Migrations)

When needed, apply the database with:

```powershell
dotnet tool run dotnet-ef database update --project src\ClinicAppointments.Infrastructure --startup-project src\ClinicAppointments.Api
```

## Planned Phases

### Phase 1

- Solution setup
- Entities and enums
- DTOs
- EF Core setup
- SQL Server configuration
- Initial migration

### Phase 2

- JWT authentication
- Register/login for doctors and patients
- Password hashing
- Role-based authorization
- Swagger with bearer auth

### Phase 3

- Doctor profile APIs
- Doctor schedule CRUD
- Public doctor listing and filtering

### Phase 4

- 30-minute slot generation
- Available slot lookup
- Exclude booked slots

### Phase 5

- Appointment booking
- Double-booking prevention
- Cancellation
- Patient and doctor appointment views

### Phase 6

- React frontend with Vite, TypeScript, and Tailwind
- Auth screens
- Patient booking flow
- Doctor scheduling flow

### Phase 7

- Optional Docker support

## Frontend Plan

We do not need a new repository for the frontend.

Recommended approach:

- Keep the frontend inside this same root folder.
- Create it as a separate project in a top-level folder such as `frontend/clinic-appointments-web`.

Recommended future structure:

```text
ClinicAppointments/
  src/
    ClinicAppointments.Api/
    ClinicAppointments.Core/
    ClinicAppointments.Infrastructure/
    ClinicAppointments.Services/
  frontend/
    clinic-appointments-web/
```

Why this is the best fit:

- Backend and frontend stay in one repo.
- It is easier to manage API/frontend changes together.
- We avoid mixing Node/Vite files into the .NET `src` folder.
- Visual Studio can still work with the .NET solution, while the React app remains a normal frontend project.

Note:

- The React app will not be a normal `.csproj` project.
- So it usually will not behave like the .NET projects inside the solution.
- That is expected.

## Notes

- Prefer opening `ClinicAppointments.sln` in Visual Studio.
- `ClinicAppointments.slnx` exists too, but `.sln` is the safer default for this repo.

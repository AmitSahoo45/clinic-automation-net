namespace ClinicAppointments.Core.DTOs.Patients;

public sealed record PatientRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber);

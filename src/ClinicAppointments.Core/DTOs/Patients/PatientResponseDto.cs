namespace ClinicAppointments.Core.DTOs.Patients;

public sealed record PatientResponseDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber);

namespace ClinicAppointments.Core.DTOs.Auth;

public sealed record RegisterPatientRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string? PhoneNumber);

namespace ClinicAppointments.Core.DTOs.Auth;

public sealed record RegisterDoctorRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Specialization,
    string? PhoneNumber,
    string? Bio);

namespace ClinicAppointments.Core.DTOs.Doctors;

public sealed record DoctorResponseDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Specialization,
    string? PhoneNumber,
    string? Bio);

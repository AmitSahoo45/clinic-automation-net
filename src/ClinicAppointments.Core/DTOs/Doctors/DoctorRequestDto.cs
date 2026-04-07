namespace ClinicAppointments.Core.DTOs.Doctors;

public sealed record DoctorRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string Specialization,
    string? PhoneNumber,
    string? Bio);

namespace ClinicAppointments.Core.DTOs.Auth;

public sealed record LoginRequestDto(
    string Email,
    string Password);

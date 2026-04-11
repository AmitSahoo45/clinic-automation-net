using ClinicAppointments.Core.Enums;

namespace ClinicAppointments.Core.DTOs.Auth;

public sealed record AuthResponseDto(
    Guid UserId,
    string Email,
    UserRole Role,
    string AccessToken,
    DateTime ExpiresAtUtc);

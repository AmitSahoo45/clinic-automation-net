using ClinicAppointments.Core.DTOs.Auth;

namespace ClinicAppointments.Api.Auth;

public sealed record AuthResult(
    bool Succeeded,
    int StatusCode,
    string? ErrorMessage,
    AuthResponseDto? Response)
{
    public static AuthResult Success(AuthResponseDto response) =>
        new(true, StatusCodes.Status200OK, null, response);

    public static AuthResult BadRequest(string errorMessage) =>
        new(false, StatusCodes.Status400BadRequest, errorMessage, null);

    public static AuthResult Unauthorized(string errorMessage) =>
        new(false, StatusCodes.Status401Unauthorized, errorMessage, null);

    public static AuthResult Conflict(string errorMessage) =>
        new(false, StatusCodes.Status409Conflict, errorMessage, null);
}

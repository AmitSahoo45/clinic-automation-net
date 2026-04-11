using ClinicAppointments.Core.DTOs.Appointments;

namespace ClinicAppointments.Api.Appointments;

public sealed record AppointmentCommandResult(
    bool Succeeded,
    int StatusCode,
    string? ErrorMessage,
    AppointmentResponseDto? Response)
{
    public static AppointmentCommandResult Success(AppointmentResponseDto response, int statusCode = StatusCodes.Status200OK) =>
        new(true, statusCode, null, response);

    public static AppointmentCommandResult BadRequest(string errorMessage) =>
        new(false, StatusCodes.Status400BadRequest, errorMessage, null);

    public static AppointmentCommandResult NotFound(string errorMessage) =>
        new(false, StatusCodes.Status404NotFound, errorMessage, null);

    public static AppointmentCommandResult Conflict(string errorMessage) =>
        new(false, StatusCodes.Status409Conflict, errorMessage, null);

    public static AppointmentCommandResult Forbidden(string errorMessage) =>
        new(false, StatusCodes.Status403Forbidden, errorMessage, null);
}

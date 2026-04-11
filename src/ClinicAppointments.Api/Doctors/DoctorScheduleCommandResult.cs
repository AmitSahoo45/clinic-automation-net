using ClinicAppointments.Core.DTOs.Schedules;

namespace ClinicAppointments.Api.Doctors;

public sealed record DoctorScheduleCommandResult(
    bool Succeeded,
    int StatusCode,
    string? ErrorMessage,
    DoctorScheduleResponseDto? Response)
{
    public static DoctorScheduleCommandResult Success(DoctorScheduleResponseDto response, int statusCode = StatusCodes.Status200OK) =>
        new(true, statusCode, null, response);

    public static DoctorScheduleCommandResult BadRequest(string errorMessage) =>
        new(false, StatusCodes.Status400BadRequest, errorMessage, null);

    public static DoctorScheduleCommandResult NotFound(string errorMessage) =>
        new(false, StatusCodes.Status404NotFound, errorMessage, null);

    public static DoctorScheduleCommandResult Conflict(string errorMessage) =>
        new(false, StatusCodes.Status409Conflict, errorMessage, null);
}

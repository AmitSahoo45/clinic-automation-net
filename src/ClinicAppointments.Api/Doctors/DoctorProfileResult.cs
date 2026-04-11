using ClinicAppointments.Core.DTOs.Doctors;

namespace ClinicAppointments.Api.Doctors;

public sealed record DoctorProfileResult(
    bool Succeeded,
    int StatusCode,
    string? ErrorMessage,
    DoctorResponseDto? Response)
{
    public static DoctorProfileResult Success(DoctorResponseDto response) =>
        new(true, StatusCodes.Status200OK, null, response);

    public static DoctorProfileResult BadRequest(string errorMessage) =>
        new(false, StatusCodes.Status400BadRequest, errorMessage, null);

    public static DoctorProfileResult NotFound(string errorMessage) =>
        new(false, StatusCodes.Status404NotFound, errorMessage, null);

    public static DoctorProfileResult Conflict(string errorMessage) =>
        new(false, StatusCodes.Status409Conflict, errorMessage, null);
}

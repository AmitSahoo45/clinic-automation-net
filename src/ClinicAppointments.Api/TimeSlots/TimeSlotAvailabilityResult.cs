using ClinicAppointments.Core.DTOs.TimeSlots;

namespace ClinicAppointments.Api.TimeSlots;

public sealed record TimeSlotAvailabilityResult(
    bool Succeeded,
    int StatusCode,
    string? ErrorMessage,
    IReadOnlyList<TimeSlotResponseDto>? Response)
{
    public static TimeSlotAvailabilityResult Success(IReadOnlyList<TimeSlotResponseDto> response) =>
        new(true, StatusCodes.Status200OK, null, response);

    public static TimeSlotAvailabilityResult BadRequest(string errorMessage) =>
        new(false, StatusCodes.Status400BadRequest, errorMessage, null);

    public static TimeSlotAvailabilityResult NotFound(string errorMessage) =>
        new(false, StatusCodes.Status404NotFound, errorMessage, null);
}

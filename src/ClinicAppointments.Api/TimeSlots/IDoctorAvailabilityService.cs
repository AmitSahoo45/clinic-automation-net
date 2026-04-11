namespace ClinicAppointments.Api.TimeSlots;

public interface IDoctorAvailabilityService
{
    Task<TimeSlotAvailabilityResult> GetAvailableSlotsAsync(
        Guid doctorId,
        DateOnly? date,
        DateOnly? startDate,
        DateOnly? endDate,
        CancellationToken cancellationToken = default);
}

namespace ClinicAppointments.Core.DTOs.TimeSlots;

public sealed record TimeSlotResponseDto(
    Guid Id,
    Guid DoctorId,
    Guid DoctorScheduleId,
    DateOnly SlotDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool IsBooked);

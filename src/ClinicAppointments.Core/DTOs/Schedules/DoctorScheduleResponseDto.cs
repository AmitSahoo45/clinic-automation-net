using ClinicDayOfWeek = ClinicAppointments.Core.Enums.DayOfWeek;

namespace ClinicAppointments.Core.DTOs.Schedules;

public sealed record DoctorScheduleResponseDto(
    Guid Id,
    Guid DoctorId,
    ClinicDayOfWeek DayOfWeek,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool IsAvailable);

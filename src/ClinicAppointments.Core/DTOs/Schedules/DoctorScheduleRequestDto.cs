using ClinicDayOfWeek = ClinicAppointments.Core.Enums.DayOfWeek;

namespace ClinicAppointments.Core.DTOs.Schedules;

public sealed record DoctorScheduleRequestDto(
    DateOnly WeekStartDate,
    ClinicDayOfWeek DayOfWeek,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool IsAvailable);

using ClinicAppointments.Api.Common;
using ClinicAppointments.Core.DTOs.Schedules;

namespace ClinicAppointments.Api.Doctors;

public interface IDoctorScheduleService
{
    Task<DoctorScheduleCommandResult> CreateScheduleAsync(Guid doctorId, DoctorScheduleRequestDto request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DoctorScheduleResponseDto>> GetSchedulesAsync(Guid doctorId, DateOnly? weekStartDate, CancellationToken cancellationToken = default);

    Task<DoctorScheduleCommandResult> UpdateScheduleAsync(Guid doctorId, Guid scheduleId, DoctorScheduleRequestDto request, CancellationToken cancellationToken = default);

    Task<OperationResult> DeleteScheduleAsync(Guid doctorId, Guid scheduleId, CancellationToken cancellationToken = default);
}

using ClinicAppointments.Core.DTOs.Appointments;
using ClinicAppointments.Core.Enums;

namespace ClinicAppointments.Api.Appointments;

public interface IAppointmentService
{
    Task<AppointmentCommandResult> BookAppointmentAsync(Guid patientId, AppointmentRequestDto request, CancellationToken cancellationToken = default);

    Task<AppointmentCommandResult> CancelAppointmentAsync(Guid appointmentId, Guid userId, UserRole userRole, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AppointmentResponseDto>> GetPatientAppointmentsAsync(Guid patientId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<AppointmentResponseDto>> GetDoctorAppointmentsAsync(Guid doctorId, CancellationToken cancellationToken = default);
}

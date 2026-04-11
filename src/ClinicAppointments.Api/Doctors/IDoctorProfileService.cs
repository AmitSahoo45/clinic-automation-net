using ClinicAppointments.Core.DTOs.Doctors;

namespace ClinicAppointments.Api.Doctors;

public interface IDoctorProfileService
{
    Task<DoctorProfileResult> GetProfileAsync(Guid doctorId, CancellationToken cancellationToken = default);

    Task<DoctorProfileResult> UpdateProfileAsync(Guid doctorId, DoctorRequestDto request, CancellationToken cancellationToken = default);
}

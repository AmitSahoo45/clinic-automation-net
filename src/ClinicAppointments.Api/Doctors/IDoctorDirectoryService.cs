using ClinicAppointments.Core.DTOs.Doctors;

namespace ClinicAppointments.Api.Doctors;

public interface IDoctorDirectoryService
{
    Task<IReadOnlyList<DoctorResponseDto>> GetDoctorsAsync(string? specialization, CancellationToken cancellationToken = default);
}

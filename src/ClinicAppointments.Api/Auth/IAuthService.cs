using ClinicAppointments.Core.DTOs.Auth;

namespace ClinicAppointments.Api.Auth;

public interface IAuthService
{
    Task<AuthResult> RegisterDoctorAsync(RegisterDoctorRequestDto request, CancellationToken cancellationToken = default);

    Task<AuthResult> RegisterPatientAsync(RegisterPatientRequestDto request, CancellationToken cancellationToken = default);

    Task<AuthResult> LoginDoctorAsync(LoginRequestDto request, CancellationToken cancellationToken = default);

    Task<AuthResult> LoginPatientAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
}

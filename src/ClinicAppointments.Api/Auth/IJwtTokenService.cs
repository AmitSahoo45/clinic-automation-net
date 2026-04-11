using ClinicAppointments.Core.Enums;

namespace ClinicAppointments.Api.Auth;

public interface IJwtTokenService
{
    JwtTokenResult GenerateToken(Guid userId, string email, UserRole role);
}

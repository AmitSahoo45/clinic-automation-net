namespace ClinicAppointments.Api.Auth;

public static class AuthorizationPolicies
{
    public const string DoctorOnly = nameof(DoctorOnly);

    public const string PatientOnly = nameof(PatientOnly);
}

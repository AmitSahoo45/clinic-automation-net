using ClinicAppointments.Api.Security;
using ClinicAppointments.Core.DTOs.Auth;
using ClinicAppointments.Core.Entities;
using ClinicAppointments.Core.Enums;
using ClinicAppointments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointments.Api.Auth;

public sealed class AuthService(
    ApplicationDbContext dbContext,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService) : IAuthService
{
    public async Task<AuthResult> RegisterDoctorAsync(RegisterDoctorRequestDto request, CancellationToken cancellationToken = default)
    {
        var validationError = ValidateRegistration(request.FirstName, request.LastName, request.Email, request.Password);
        if (validationError is not null)
        {
            return AuthResult.BadRequest(validationError);
        }

        if (string.IsNullOrWhiteSpace(request.Specialization))
        {
            return AuthResult.BadRequest("Specialization is required.");
        }

        var normalizedEmail = NormalizeEmail(request.Email);

        var exists = await dbContext.Doctors.AnyAsync(doctor => doctor.Email == normalizedEmail, cancellationToken);
        if (exists)
        {
            return AuthResult.Conflict("A doctor with this email already exists.");
        }

        var doctor = new Doctor
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            Specialization = request.Specialization.Trim(),
            PhoneNumber = NormalizeOptional(request.PhoneNumber),
            Bio = NormalizeOptional(request.Bio)
        };

        dbContext.Doctors.Add(doctor);
        await dbContext.SaveChangesAsync(cancellationToken);

        return AuthResult.Success(CreateResponse(doctor.Id, doctor.Email, UserRole.Doctor));
    }

    public async Task<AuthResult> RegisterPatientAsync(RegisterPatientRequestDto request, CancellationToken cancellationToken = default)
    {
        var validationError = ValidateRegistration(request.FirstName, request.LastName, request.Email, request.Password);
        if (validationError is not null)
        {
            return AuthResult.BadRequest(validationError);
        }

        var normalizedEmail = NormalizeEmail(request.Email);

        var exists = await dbContext.Patients.AnyAsync(patient => patient.Email == normalizedEmail, cancellationToken);
        if (exists)
        {
            return AuthResult.Conflict("A patient with this email already exists.");
        }

        var patient = new Patient
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHasher.HashPassword(request.Password),
            PhoneNumber = NormalizeOptional(request.PhoneNumber)
        };

        dbContext.Patients.Add(patient);
        await dbContext.SaveChangesAsync(cancellationToken);

        return AuthResult.Success(CreateResponse(patient.Id, patient.Email, UserRole.Patient));
    }

    public async Task<AuthResult> LoginDoctorAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var validationError = ValidateLogin(request);
        if (validationError is not null)
        {
            return AuthResult.BadRequest(validationError);
        }

        var normalizedEmail = NormalizeEmail(request.Email);
        var doctor = await dbContext.Doctors.SingleOrDefaultAsync(item => item.Email == normalizedEmail, cancellationToken);

        if (doctor is null || !passwordHasher.VerifyPassword(request.Password, doctor.PasswordHash))
        {
            return AuthResult.Unauthorized("Invalid email or password.");
        }

        return AuthResult.Success(CreateResponse(doctor.Id, doctor.Email, UserRole.Doctor));
    }

    public async Task<AuthResult> LoginPatientAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var validationError = ValidateLogin(request);
        if (validationError is not null)
        {
            return AuthResult.BadRequest(validationError);
        }

        var normalizedEmail = NormalizeEmail(request.Email);
        var patient = await dbContext.Patients.SingleOrDefaultAsync(item => item.Email == normalizedEmail, cancellationToken);

        if (patient is null || !passwordHasher.VerifyPassword(request.Password, patient.PasswordHash))
        {
            return AuthResult.Unauthorized("Invalid email or password.");
        }

        return AuthResult.Success(CreateResponse(patient.Id, patient.Email, UserRole.Patient));
    }

    private AuthResponseDto CreateResponse(Guid userId, string email, UserRole role)
    {
        var token = jwtTokenService.GenerateToken(userId, email, role);
        return new AuthResponseDto(userId, email, role, token.AccessToken, token.ExpiresAtUtc);
    }

    private static string? ValidateRegistration(string firstName, string lastName, string email, string password)
    {
        if (string.IsNullOrWhiteSpace(firstName))
        {
            return "First name is required.";
        }

        if (string.IsNullOrWhiteSpace(lastName))
        {
            return "Last name is required.";
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            return "Email is required.";
        }

        if (!IsValidEmail(email))
        {
            return "A valid email address is required.";
        }

        if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
        {
            return "Password must be at least 8 characters long.";
        }

        return null;
    }

    private static string? ValidateLogin(LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return "Email is required.";
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return "Password is required.";
        }

        return null;
    }

    private static bool IsValidEmail(string email) =>
        email.Contains('@', StringComparison.Ordinal) &&
        email.Contains('.', StringComparison.Ordinal);

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();

    private static string? NormalizeOptional(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

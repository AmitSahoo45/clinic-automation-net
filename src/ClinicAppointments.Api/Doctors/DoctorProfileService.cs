using ClinicAppointments.Core.DTOs.Doctors;
using ClinicAppointments.Core.Entities;
using ClinicAppointments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointments.Api.Doctors;

public sealed class DoctorProfileService(ApplicationDbContext dbContext) : IDoctorProfileService
{
    public async Task<DoctorProfileResult> GetProfileAsync(Guid doctorId, CancellationToken cancellationToken = default)
    {
        var doctor = await dbContext.Doctors
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == doctorId, cancellationToken);

        if (doctor is null)
        {
            return DoctorProfileResult.NotFound("Doctor profile was not found.");
        }

        return DoctorProfileResult.Success(MapToResponse(doctor));
    }

    public async Task<DoctorProfileResult> UpdateProfileAsync(Guid doctorId, DoctorRequestDto request, CancellationToken cancellationToken = default)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return DoctorProfileResult.BadRequest(validationError);
        }

        var doctor = await dbContext.Doctors.SingleOrDefaultAsync(item => item.Id == doctorId, cancellationToken);
        if (doctor is null)
        {
            return DoctorProfileResult.NotFound("Doctor profile was not found.");
        }

        var normalizedEmail = NormalizeEmail(request.Email);

        var emailInUse = await dbContext.Doctors.AnyAsync(
            item => item.Id != doctorId && item.Email == normalizedEmail,
            cancellationToken);

        if (emailInUse)
        {
            return DoctorProfileResult.Conflict("Another doctor already uses this email address.");
        }

        doctor.FirstName = request.FirstName.Trim();
        doctor.LastName = request.LastName.Trim();
        doctor.Email = normalizedEmail;
        doctor.Specialization = request.Specialization.Trim();
        doctor.PhoneNumber = NormalizeOptional(request.PhoneNumber);
        doctor.Bio = NormalizeOptional(request.Bio);

        await dbContext.SaveChangesAsync(cancellationToken);

        return DoctorProfileResult.Success(MapToResponse(doctor));
    }

    private static DoctorResponseDto MapToResponse(Doctor doctor) =>
        new(
            doctor.Id,
            doctor.FirstName,
            doctor.LastName,
            doctor.Email,
            doctor.Specialization,
            doctor.PhoneNumber,
            doctor.Bio);

    private static string? ValidateRequest(DoctorRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName))
        {
            return "First name is required.";
        }

        if (string.IsNullOrWhiteSpace(request.LastName))
        {
            return "Last name is required.";
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return "Email is required.";
        }

        if (!IsValidEmail(request.Email))
        {
            return "A valid email address is required.";
        }

        if (string.IsNullOrWhiteSpace(request.Specialization))
        {
            return "Specialization is required.";
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

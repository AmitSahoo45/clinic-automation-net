using ClinicAppointments.Core.DTOs.Doctors;
using ClinicAppointments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointments.Api.Doctors;

public sealed class DoctorDirectoryService(ApplicationDbContext dbContext) : IDoctorDirectoryService
{
    public async Task<IReadOnlyList<DoctorResponseDto>> GetDoctorsAsync(string? specialization, CancellationToken cancellationToken = default)
    {
        var query = dbContext.Doctors.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(specialization))
        {
            var normalizedSpecialization = specialization.Trim();
            query = query.Where(item => item.Specialization.Contains(normalizedSpecialization));
        }

        return await query
            .OrderBy(item => item.FirstName)
            .ThenBy(item => item.LastName)
            .Select(item => new DoctorResponseDto(
                item.Id,
                item.FirstName,
                item.LastName,
                item.Email,
                item.Specialization,
                item.PhoneNumber,
                item.Bio))
            .ToListAsync(cancellationToken);
    }
}

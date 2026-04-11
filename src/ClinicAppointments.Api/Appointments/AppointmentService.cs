using System.Security.Claims;
using ClinicAppointments.Core.DTOs.Appointments;
using ClinicAppointments.Core.Entities;
using ClinicAppointments.Core.Enums;
using ClinicAppointments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointments.Api.Appointments;

public sealed class AppointmentService(ApplicationDbContext dbContext) : IAppointmentService
{
    public async Task<AppointmentCommandResult> BookAppointmentAsync(Guid patientId, AppointmentRequestDto request, CancellationToken cancellationToken = default)
    {
        if (request.TimeSlotId == Guid.Empty)
        {
            return AppointmentCommandResult.BadRequest("TimeSlotId is required.");
        }

        var patientExists = await dbContext.Patients
            .AsNoTracking()
            .AnyAsync(item => item.Id == patientId, cancellationToken);

        if (!patientExists)
        {
            return AppointmentCommandResult.NotFound("Patient was not found.");
        }

        var slot = await dbContext.TimeSlots
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == request.TimeSlotId, cancellationToken);

        if (slot is null)
        {
            return AppointmentCommandResult.NotFound("Time slot was not found.");
        }

        if (slot.IsBooked)
        {
            return AppointmentCommandResult.Conflict("This time slot is already booked.");
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        var updatedRows = await dbContext.TimeSlots
            .Where(item => item.Id == request.TimeSlotId && !item.IsBooked)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(item => item.IsBooked, true),
                cancellationToken);

        if (updatedRows == 0)
        {
            return AppointmentCommandResult.Conflict("This time slot is already booked.");
        }

        var appointment = new Appointment
        {
            DoctorId = slot.DoctorId,
            PatientId = patientId,
            TimeSlotId = slot.Id,
            Status = AppointmentStatus.Confirmed,
            Notes = NormalizeOptional(request.Notes)
        };

        dbContext.Appointments.Add(appointment);
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        var response = await GetAppointmentResponseAsync(appointment.Id, cancellationToken);
        return AppointmentCommandResult.Success(response!, StatusCodes.Status201Created);
    }

    public async Task<AppointmentCommandResult> CancelAppointmentAsync(Guid appointmentId, Guid userId, UserRole userRole, CancellationToken cancellationToken = default)
    {
        var appointment = await dbContext.Appointments
            .Include(item => item.TimeSlot)
            .Include(item => item.Doctor)
            .Include(item => item.Patient)
            .SingleOrDefaultAsync(item => item.Id == appointmentId, cancellationToken);

        if (appointment is null)
        {
            return AppointmentCommandResult.NotFound("Appointment was not found.");
        }

        var authorized = userRole switch
        {
            UserRole.Doctor => appointment.DoctorId == userId,
            UserRole.Patient => appointment.PatientId == userId,
            _ => false
        };

        if (!authorized)
        {
            return AppointmentCommandResult.Forbidden("You are not allowed to cancel this appointment.");
        }

        if (appointment.Status == AppointmentStatus.Cancelled)
        {
            return AppointmentCommandResult.Conflict("This appointment is already cancelled.");
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);

        appointment.Status = AppointmentStatus.Cancelled;

        if (appointment.TimeSlot is not null)
        {
            appointment.TimeSlot.IsBooked = false;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return AppointmentCommandResult.Success(MapToResponse(appointment));
    }

    public async Task<IReadOnlyList<AppointmentResponseDto>> GetPatientAppointmentsAsync(Guid patientId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Appointments
            .AsNoTracking()
            .Include(item => item.TimeSlot)
            .Include(item => item.Doctor)
            .Include(item => item.Patient)
            .Where(item => item.PatientId == patientId)
            .OrderBy(item => item.TimeSlot!.SlotDate)
            .ThenBy(item => item.TimeSlot!.StartTime)
            .Select(item => MapToResponse(item))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AppointmentResponseDto>> GetDoctorAppointmentsAsync(Guid doctorId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Appointments
            .AsNoTracking()
            .Include(item => item.TimeSlot)
            .Include(item => item.Doctor)
            .Include(item => item.Patient)
            .Where(item => item.DoctorId == doctorId)
            .OrderBy(item => item.TimeSlot!.SlotDate)
            .ThenBy(item => item.TimeSlot!.StartTime)
            .Select(item => MapToResponse(item))
            .ToListAsync(cancellationToken);
    }

    private async Task<AppointmentResponseDto?> GetAppointmentResponseAsync(Guid appointmentId, CancellationToken cancellationToken)
    {
        return await dbContext.Appointments
            .AsNoTracking()
            .Include(item => item.TimeSlot)
            .Include(item => item.Doctor)
            .Include(item => item.Patient)
            .Where(item => item.Id == appointmentId)
            .Select(item => MapToResponse(item))
            .SingleOrDefaultAsync(cancellationToken);
    }

    private static AppointmentResponseDto MapToResponse(Appointment appointment) =>
        new(
            appointment.Id,
            appointment.DoctorId,
            $"{appointment.Doctor?.FirstName} {appointment.Doctor?.LastName}".Trim(),
            appointment.PatientId,
            $"{appointment.Patient?.FirstName} {appointment.Patient?.LastName}".Trim(),
            appointment.TimeSlotId,
            appointment.TimeSlot?.SlotDate ?? default,
            appointment.TimeSlot?.StartTime ?? default,
            appointment.TimeSlot?.EndTime ?? default,
            appointment.Status,
            appointment.BookedAtUtc,
            appointment.Notes);

    private static string? NormalizeOptional(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}

using ClinicAppointments.Api.Common;
using ClinicAppointments.Core.DTOs.Schedules;
using ClinicAppointments.Core.Entities;
using ClinicAppointments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ClinicAppointments.Api.Doctors;

public sealed class DoctorScheduleService(ApplicationDbContext dbContext) : IDoctorScheduleService
{
    public async Task<DoctorScheduleCommandResult> CreateScheduleAsync(Guid doctorId, DoctorScheduleRequestDto request, CancellationToken cancellationToken = default)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return DoctorScheduleCommandResult.BadRequest(validationError);
        }

        var exists = await dbContext.DoctorSchedules.AnyAsync(
            item => item.DoctorId == doctorId
                && item.WeekStartDate == request.WeekStartDate
                && item.DayOfWeek == request.DayOfWeek,
            cancellationToken);

        if (exists)
        {
            return DoctorScheduleCommandResult.Conflict("A schedule entry for this week and day already exists.");
        }

        var schedule = new DoctorSchedule
        {
            DoctorId = doctorId,
            WeekStartDate = request.WeekStartDate,
            DayOfWeek = request.DayOfWeek,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            IsAvailable = request.IsAvailable
        };

        dbContext.DoctorSchedules.Add(schedule);
        await dbContext.SaveChangesAsync(cancellationToken);

        return DoctorScheduleCommandResult.Success(MapToResponse(schedule), StatusCodes.Status201Created);
    }

    public async Task<IReadOnlyList<DoctorScheduleResponseDto>> GetSchedulesAsync(Guid doctorId, DateOnly? weekStartDate, CancellationToken cancellationToken = default)
    {
        var query = dbContext.DoctorSchedules
            .AsNoTracking()
            .Where(item => item.DoctorId == doctorId);

        if (weekStartDate.HasValue)
        {
            query = query.Where(item => item.WeekStartDate == weekStartDate.Value);
        }

        return await query
            .OrderBy(item => item.WeekStartDate)
            .ThenBy(item => item.DayOfWeek)
            .ThenBy(item => item.StartTime)
            .Select(item => MapToResponse(item))
            .ToListAsync(cancellationToken);
    }

    public async Task<DoctorScheduleCommandResult> UpdateScheduleAsync(Guid doctorId, Guid scheduleId, DoctorScheduleRequestDto request, CancellationToken cancellationToken = default)
    {
        var validationError = ValidateRequest(request);
        if (validationError is not null)
        {
            return DoctorScheduleCommandResult.BadRequest(validationError);
        }

        var schedule = await dbContext.DoctorSchedules.SingleOrDefaultAsync(
            item => item.Id == scheduleId && item.DoctorId == doctorId,
            cancellationToken);

        if (schedule is null)
        {
            return DoctorScheduleCommandResult.NotFound("Schedule entry was not found.");
        }

        var duplicate = await dbContext.DoctorSchedules.AnyAsync(
            item => item.Id != scheduleId
                && item.DoctorId == doctorId
                && item.WeekStartDate == request.WeekStartDate
                && item.DayOfWeek == request.DayOfWeek,
            cancellationToken);

        if (duplicate)
        {
            return DoctorScheduleCommandResult.Conflict("Another schedule entry for this week and day already exists.");
        }

        schedule.WeekStartDate = request.WeekStartDate;
        schedule.DayOfWeek = request.DayOfWeek;
        schedule.StartTime = request.StartTime;
        schedule.EndTime = request.EndTime;
        schedule.IsAvailable = request.IsAvailable;

        await dbContext.SaveChangesAsync(cancellationToken);

        return DoctorScheduleCommandResult.Success(MapToResponse(schedule));
    }

    public async Task<OperationResult> DeleteScheduleAsync(Guid doctorId, Guid scheduleId, CancellationToken cancellationToken = default)
    {
        var schedule = await dbContext.DoctorSchedules.SingleOrDefaultAsync(
            item => item.Id == scheduleId && item.DoctorId == doctorId,
            cancellationToken);

        if (schedule is null)
        {
            return OperationResult.NotFound("Schedule entry was not found.");
        }

        dbContext.DoctorSchedules.Remove(schedule);
        await dbContext.SaveChangesAsync(cancellationToken);

        return OperationResult.Success();
    }

    private static string? ValidateRequest(DoctorScheduleRequestDto request)
    {
        if (request.WeekStartDate.DayOfWeek != DayOfWeek.Monday)
        {
            return "WeekStartDate must be a Monday.";
        }

        if (!Enum.IsDefined(request.DayOfWeek) || (int)request.DayOfWeek < 1 || (int)request.DayOfWeek > 7)
        {
            return "DayOfWeek must be between 1 (Monday) and 7 (Sunday).";
        }

        if (request.StartTime >= request.EndTime)
        {
            return "Start time must be earlier than end time.";
        }

        return null;
    }

    private static DoctorScheduleResponseDto MapToResponse(DoctorSchedule schedule) =>
        new(
            schedule.Id,
            schedule.DoctorId,
            schedule.WeekStartDate,
            schedule.DayOfWeek,
            schedule.StartTime,
            schedule.EndTime,
            schedule.IsAvailable);
}

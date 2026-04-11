using ClinicAppointments.Core.DTOs.TimeSlots;
using ClinicAppointments.Core.Entities;
using ClinicAppointments.Core.Enums;
using ClinicAppointments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using ClinicDayOfWeek = ClinicAppointments.Core.Enums.DayOfWeek;

namespace ClinicAppointments.Api.TimeSlots;

public sealed class DoctorAvailabilityService(ApplicationDbContext dbContext) : IDoctorAvailabilityService
{
    private static readonly TimeSpan SlotDuration = TimeSpan.FromMinutes(30);

    public async Task<TimeSlotAvailabilityResult> GetAvailableSlotsAsync(
        Guid doctorId,
        DateOnly? date,
        DateOnly? startDate,
        DateOnly? endDate,
        CancellationToken cancellationToken = default)
    {
        var validationResult = ValidateQuery(date, startDate, endDate);
        if (validationResult is not null)
        {
            return validationResult;
        }

        var rangeStart = date ?? startDate!.Value;
        var rangeEnd = date ?? endDate!.Value;

        var doctorExists = await dbContext.Doctors
            .AsNoTracking()
            .AnyAsync(item => item.Id == doctorId, cancellationToken);

        if (!doctorExists)
        {
            return TimeSlotAvailabilityResult.NotFound("Doctor was not found.");
        }

        var requestedDates = GetDatesInRange(rangeStart, rangeEnd);
        var weekStartDates = requestedDates
            .Select(GetWeekStartDate)
            .Distinct()
            .ToList();

        var schedules = await dbContext.DoctorSchedules
            .AsNoTracking()
            .Where(item => item.DoctorId == doctorId
                && item.IsAvailable
                && weekStartDates.Contains(item.WeekStartDate))
            .ToListAsync(cancellationToken);

        var scheduleLookup = schedules.ToDictionary(
            item => (item.WeekStartDate, item.DayOfWeek),
            item => item);

        var existingSlots = await dbContext.TimeSlots
            .Include(item => item.Appointment)
            .Where(item => item.DoctorId == doctorId
                && item.SlotDate >= rangeStart
                && item.SlotDate <= rangeEnd)
            .ToListAsync(cancellationToken);

        var slotLookup = existingSlots.ToDictionary(
            item => (item.DoctorScheduleId, item.SlotDate, item.StartTime, item.EndTime),
            item => item);

        var availableSlots = new List<TimeSlotResponseDto>();
        var hasNewSlots = false;

        foreach (var slotDate in requestedDates)
        {
            var weekStartDate = GetWeekStartDate(slotDate);
            var dayOfWeek = MapDayOfWeek(slotDate.DayOfWeek);

            if (!scheduleLookup.TryGetValue((weekStartDate, dayOfWeek), out var schedule))
            {
                continue;
            }

            var currentStart = schedule.StartTime;
            while (currentStart.Add(SlotDuration) <= schedule.EndTime)
            {
                var currentEnd = currentStart.Add(SlotDuration);
                var slotKey = (schedule.Id, slotDate, currentStart, currentEnd);

                if (!slotLookup.TryGetValue(slotKey, out var slot))
                {
                    slot = new TimeSlot
                    {
                        DoctorId = doctorId,
                        DoctorScheduleId = schedule.Id,
                        SlotDate = slotDate,
                        StartTime = currentStart,
                        EndTime = currentEnd,
                        IsBooked = false
                    };

                    dbContext.TimeSlots.Add(slot);
                    slotLookup[slotKey] = slot;
                    hasNewSlots = true;
                }

                if (IsAvailable(slot))
                {
                    availableSlots.Add(new TimeSlotResponseDto(
                        slot.Id,
                        slot.DoctorId,
                        slot.DoctorScheduleId,
                        slot.SlotDate,
                        slot.StartTime,
                        slot.EndTime,
                        slot.IsBooked));
                }

                currentStart = currentEnd;
            }
        }

        if (hasNewSlots)
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        var orderedSlots = availableSlots
            .OrderBy(item => item.SlotDate)
            .ThenBy(item => item.StartTime)
            .ToList();

        return TimeSlotAvailabilityResult.Success(orderedSlots);
    }

    private static TimeSlotAvailabilityResult? ValidateQuery(DateOnly? date, DateOnly? startDate, DateOnly? endDate)
    {
        var singleDateRequested = date.HasValue;
        var rangeRequested = startDate.HasValue || endDate.HasValue;

        if (singleDateRequested && rangeRequested)
        {
            return TimeSlotAvailabilityResult.BadRequest("Use either 'date' or 'startDate'/'endDate', not both.");
        }

        if (!singleDateRequested && (!startDate.HasValue || !endDate.HasValue))
        {
            return TimeSlotAvailabilityResult.BadRequest("Provide either 'date' or both 'startDate' and 'endDate'.");
        }

        if (startDate.HasValue && endDate.HasValue && startDate.Value > endDate.Value)
        {
            return TimeSlotAvailabilityResult.BadRequest("'startDate' must be earlier than or equal to 'endDate'.");
        }

        return null;
    }

    private static List<DateOnly> GetDatesInRange(DateOnly startDate, DateOnly endDate)
    {
        var dates = new List<DateOnly>();
        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            dates.Add(date);
        }

        return dates;
    }

    private static DateOnly GetWeekStartDate(DateOnly date)
    {
        var offset = ((int)date.DayOfWeek + 6) % 7;
        return date.AddDays(-offset);
    }

    private static ClinicDayOfWeek MapDayOfWeek(System.DayOfWeek dayOfWeek) => dayOfWeek switch
    {
        System.DayOfWeek.Monday => ClinicDayOfWeek.Monday,
        System.DayOfWeek.Tuesday => ClinicDayOfWeek.Tuesday,
        System.DayOfWeek.Wednesday => ClinicDayOfWeek.Wednesday,
        System.DayOfWeek.Thursday => ClinicDayOfWeek.Thursday,
        System.DayOfWeek.Friday => ClinicDayOfWeek.Friday,
        System.DayOfWeek.Saturday => ClinicDayOfWeek.Saturday,
        System.DayOfWeek.Sunday => ClinicDayOfWeek.Sunday,
        _ => throw new ArgumentOutOfRangeException(nameof(dayOfWeek), dayOfWeek, "Unsupported day of week.")
    };

    private static bool IsAvailable(TimeSlot slot) =>
        !slot.IsBooked && (slot.Appointment is null || slot.Appointment.Status == AppointmentStatus.Cancelled);
}

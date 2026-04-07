using ClinicAppointments.Core.Common;
using ClinicDayOfWeek = ClinicAppointments.Core.Enums.DayOfWeek;

namespace ClinicAppointments.Core.Entities;

public class DoctorSchedule : BaseEntity
{
    public Guid DoctorId { get; set; }

    public ClinicDayOfWeek DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public bool IsAvailable { get; set; } = true;

    public Doctor? Doctor { get; set; }

    public ICollection<TimeSlot> TimeSlots { get; set; } = [];
}

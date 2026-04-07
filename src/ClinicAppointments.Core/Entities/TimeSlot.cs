using ClinicAppointments.Core.Common;

namespace ClinicAppointments.Core.Entities;

public class TimeSlot : BaseEntity
{
    public Guid DoctorId { get; set; }

    public Guid DoctorScheduleId { get; set; }

    public DateOnly SlotDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public bool IsBooked { get; set; }

    public Doctor? Doctor { get; set; }

    public DoctorSchedule? DoctorSchedule { get; set; }

    public Appointment? Appointment { get; set; }
}

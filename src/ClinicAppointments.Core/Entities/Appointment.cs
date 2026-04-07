using ClinicAppointments.Core.Common;
using AppointmentState = ClinicAppointments.Core.Enums.AppointmentStatus;

namespace ClinicAppointments.Core.Entities;

public class Appointment : BaseEntity
{
    public Guid DoctorId { get; set; }

    public Guid PatientId { get; set; }

    public Guid TimeSlotId { get; set; }

    public AppointmentState Status { get; set; } = AppointmentState.Pending;

    public string? Notes { get; set; }

    public DateTime BookedAtUtc { get; set; } = DateTime.UtcNow;

    public Doctor? Doctor { get; set; }

    public Patient? Patient { get; set; }

    public TimeSlot? TimeSlot { get; set; }
}

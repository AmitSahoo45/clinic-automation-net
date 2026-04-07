using ClinicAppointments.Core.Common;

namespace ClinicAppointments.Core.Entities;

public class Doctor : BaseEntity
{
    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public required string Email { get; set; }

    public required string PasswordHash { get; set; }

    public required string Specialization { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Bio { get; set; }

    public ICollection<DoctorSchedule> Schedules { get; set; } = [];

    public ICollection<TimeSlot> TimeSlots { get; set; } = [];

    public ICollection<Appointment> Appointments { get; set; } = [];
}

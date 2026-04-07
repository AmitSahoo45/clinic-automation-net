using ClinicAppointments.Core.Common;

namespace ClinicAppointments.Core.Entities;

public class Patient : BaseEntity
{
    public required string FirstName { get; set; }

    public required string LastName { get; set; }

    public required string Email { get; set; }

    public required string PasswordHash { get; set; }

    public string? PhoneNumber { get; set; }

    public ICollection<Appointment> Appointments { get; set; } = [];
}

namespace ClinicAppointments.Core.DTOs.Appointments;

public sealed record AppointmentRequestDto(
    Guid TimeSlotId,
    string? Notes);

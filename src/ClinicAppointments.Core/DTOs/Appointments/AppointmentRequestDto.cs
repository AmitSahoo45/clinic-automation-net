namespace ClinicAppointments.Core.DTOs.Appointments;

public sealed record AppointmentRequestDto(
    Guid DoctorId,
    Guid PatientId,
    Guid TimeSlotId,
    string? Notes);

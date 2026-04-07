using AppointmentState = ClinicAppointments.Core.Enums.AppointmentStatus;

namespace ClinicAppointments.Core.DTOs.Appointments;

public sealed record AppointmentResponseDto(
    Guid Id,
    Guid DoctorId,
    Guid PatientId,
    Guid TimeSlotId,
    AppointmentState Status,
    DateTime BookedAtUtc,
    string? Notes);

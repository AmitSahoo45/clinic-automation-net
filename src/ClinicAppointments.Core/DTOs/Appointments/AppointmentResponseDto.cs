using AppointmentState = ClinicAppointments.Core.Enums.AppointmentStatus;

namespace ClinicAppointments.Core.DTOs.Appointments;

public sealed record AppointmentResponseDto(
    Guid Id,
    Guid DoctorId,
    string DoctorName,
    Guid PatientId,
    string PatientName,
    Guid TimeSlotId,
    DateOnly SlotDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    AppointmentState Status,
    DateTime BookedAtUtc,
    string? Notes);

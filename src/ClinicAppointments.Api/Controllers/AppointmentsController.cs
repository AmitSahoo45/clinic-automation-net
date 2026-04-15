using System.Security.Claims;
using ClinicAppointments.Api.Appointments;
using ClinicAppointments.Api.Auth;
using ClinicAppointments.Core.DTOs.Appointments;
using ClinicAppointments.Core.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointments.Api.Controllers;

[ApiController]
[Route("api/appointments")]
[Authorize]
public sealed class AppointmentsController(IAppointmentService appointmentService) : ControllerBase
{
    [Authorize(Policy = AuthorizationPolicies.PatientOnly)]
    [HttpPost]
    public async Task<IActionResult> BookAppointment(AppointmentRequestDto request, CancellationToken cancellationToken)
    {
        var patientId = GetCurrentUserId();
        if (patientId is null)
        {
            return Unauthorized(new { Message = "Patient identity was not found in the token." });
        }

        var result = await appointmentService.BookAppointmentAsync(patientId.Value, request, cancellationToken);
        return ToActionResult(result);
    }

    [HttpPut("{appointmentId:guid}/cancel")]
    public async Task<IActionResult> CancelAppointment(Guid appointmentId, CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var userRole = GetCurrentUserRole();

        if (userId is null || userRole is null)
        {
            return Unauthorized(new { Message = "User identity was not found in the token." });
        }

        var result = await appointmentService.CancelAppointmentAsync(appointmentId, userId.Value, userRole.Value, cancellationToken);
        return ToActionResult(result);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpPut("{appointmentId:guid}/complete")]
    public async Task<IActionResult> CompleteAppointment(Guid appointmentId, CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var result = await appointmentService.CompleteAppointmentAsync(appointmentId, doctorId.Value, cancellationToken);
        return ToActionResult(result);
    }

    [Authorize(Policy = AuthorizationPolicies.PatientOnly)]
    [HttpGet("patient/me")]
    public async Task<IActionResult> GetMyPatientAppointments(CancellationToken cancellationToken)
    {
        var patientId = GetCurrentUserId();
        if (patientId is null)
        {
            return Unauthorized(new { Message = "Patient identity was not found in the token." });
        }

        var appointments = await appointmentService.GetPatientAppointmentsAsync(patientId.Value, cancellationToken);
        return Ok(appointments);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpGet("doctor/me")]
    public async Task<IActionResult> GetMyDoctorAppointments(CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentUserId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var appointments = await appointmentService.GetDoctorAppointmentsAsync(doctorId.Value, cancellationToken);
        return Ok(appointments);
    }

    private Guid? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : null;
    }

    private UserRole? GetCurrentUserRole()
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        return Enum.TryParse<UserRole>(role, out var userRole) ? userRole : null;
    }

    private IActionResult ToActionResult(AppointmentCommandResult result)
    {
        if (result.Succeeded)
        {
            return result.StatusCode == StatusCodes.Status201Created
                ? StatusCode(StatusCodes.Status201Created, result.Response)
                : Ok(result.Response);
        }

        return StatusCode(result.StatusCode, new
        {
            Message = result.ErrorMessage
        });
    }
}

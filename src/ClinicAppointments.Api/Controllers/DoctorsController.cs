using System.Security.Claims;
using ClinicAppointments.Api.Auth;
using ClinicAppointments.Api.Common;
using ClinicAppointments.Api.Doctors;
using ClinicAppointments.Core.DTOs.Doctors;
using ClinicAppointments.Core.DTOs.Schedules;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointments.Api.Controllers;

[ApiController]
[Route("api/doctors")]
public sealed class DoctorsController(
    IDoctorProfileService doctorProfileService,
    IDoctorScheduleService doctorScheduleService,
    IDoctorDirectoryService doctorDirectoryService) : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetDoctors([FromQuery] string? specialization, CancellationToken cancellationToken)
    {
        var doctors = await doctorDirectoryService.GetDoctorsAsync(specialization, cancellationToken);
        return Ok(doctors);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile(CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentDoctorId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var result = await doctorProfileService.GetProfileAsync(doctorId.Value, cancellationToken);
        return ToActionResult(result);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile(DoctorRequestDto request, CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentDoctorId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var result = await doctorProfileService.UpdateProfileAsync(doctorId.Value, request, cancellationToken);
        return ToActionResult(result);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpPost("schedules")]
    public async Task<IActionResult> CreateSchedule(DoctorScheduleRequestDto request, CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentDoctorId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var result = await doctorScheduleService.CreateScheduleAsync(doctorId.Value, request, cancellationToken);
        return ToActionResult(result);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpGet("schedules")]
    public async Task<IActionResult> GetSchedules([FromQuery] DateOnly? weekStartDate, CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentDoctorId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var schedules = await doctorScheduleService.GetSchedulesAsync(doctorId.Value, weekStartDate, cancellationToken);
        return Ok(schedules);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpPut("schedules/{scheduleId:guid}")]
    public async Task<IActionResult> UpdateSchedule(Guid scheduleId, DoctorScheduleRequestDto request, CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentDoctorId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var result = await doctorScheduleService.UpdateScheduleAsync(doctorId.Value, scheduleId, request, cancellationToken);
        return ToActionResult(result);
    }

    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    [HttpDelete("schedules/{scheduleId:guid}")]
    public async Task<IActionResult> DeleteSchedule(Guid scheduleId, CancellationToken cancellationToken)
    {
        var doctorId = GetCurrentDoctorId();
        if (doctorId is null)
        {
            return Unauthorized(new { Message = "Doctor identity was not found in the token." });
        }

        var result = await doctorScheduleService.DeleteScheduleAsync(doctorId.Value, scheduleId, cancellationToken);
        return ToActionResult(result);
    }

    private Guid? GetCurrentDoctorId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out var doctorId) ? doctorId : null;
    }

    private IActionResult ToActionResult(DoctorProfileResult result)
    {
        if (result.Succeeded)
        {
            return Ok(result.Response);
        }

        return StatusCode(result.StatusCode, new
        {
            Message = result.ErrorMessage
        });
    }

    private IActionResult ToActionResult(DoctorScheduleCommandResult result)
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

    private IActionResult ToActionResult(OperationResult result)
    {
        if (result.Succeeded)
        {
            return NoContent();
        }

        return StatusCode(result.StatusCode, new
        {
            Message = result.ErrorMessage
        });
    }
}

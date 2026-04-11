using System.Security.Claims;
using ClinicAppointments.Api.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointments.Api.Controllers;

[ApiController]
[Route("api/authorization")]
[Authorize]
public sealed class AuthorizationController : ControllerBase
{
    [HttpGet("authenticated")]
    public IActionResult Authenticated()
    {
        return Ok(new
        {
            Message = "You are authenticated.",
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            Email = User.FindFirstValue(ClaimTypes.Email),
            Role = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpGet("doctor-only")]
    [Authorize(Policy = AuthorizationPolicies.DoctorOnly)]
    public IActionResult DoctorOnly()
    {
        return Ok(new
        {
            Message = "Doctor access granted.",
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            Email = User.FindFirstValue(ClaimTypes.Email),
            Role = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpGet("patient-only")]
    [Authorize(Policy = AuthorizationPolicies.PatientOnly)]
    public IActionResult PatientOnly()
    {
        return Ok(new
        {
            Message = "Patient access granted.",
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            Email = User.FindFirstValue(ClaimTypes.Email),
            Role = User.FindFirstValue(ClaimTypes.Role)
        });
    }
}

using System.Security.Claims;
using ClinicAppointments.Api.Auth;
using ClinicAppointments.Core.DTOs.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicAppointments.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("doctors/register")]
    public async Task<IActionResult> RegisterDoctor(RegisterDoctorRequestDto request, CancellationToken cancellationToken)
    {
        var result = await authService.RegisterDoctorAsync(request, cancellationToken);
        return ToActionResult(result);
    }

    [AllowAnonymous]
    [HttpPost("doctors/login")]
    public async Task<IActionResult> LoginDoctor(LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await authService.LoginDoctorAsync(request, cancellationToken);
        return ToActionResult(result);
    }

    [AllowAnonymous]
    [HttpPost("patients/register")]
    public async Task<IActionResult> RegisterPatient(RegisterPatientRequestDto request, CancellationToken cancellationToken)
    {
        var result = await authService.RegisterPatientAsync(request, cancellationToken);
        return ToActionResult(result);
    }

    [AllowAnonymous]
    [HttpPost("patients/login")]
    public async Task<IActionResult> LoginPatient(LoginRequestDto request, CancellationToken cancellationToken)
    {
        var result = await authService.LoginPatientAsync(request, cancellationToken);
        return ToActionResult(result);
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            Email = User.FindFirstValue(ClaimTypes.Email),
            Role = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    private IActionResult ToActionResult(AuthResult result)
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
}

using ClinicAppointments.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();
app.MapGet("/", () => Results.Ok(new
{
    Name = "Clinic Appointments API",
    Status = "Phase 1 setup complete"
}));

app.Run();

public partial class Program;

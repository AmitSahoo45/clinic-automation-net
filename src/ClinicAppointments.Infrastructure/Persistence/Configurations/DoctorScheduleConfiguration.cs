using ClinicAppointments.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinicAppointments.Infrastructure.Persistence.Configurations;

public class DoctorScheduleConfiguration : IEntityTypeConfiguration<DoctorSchedule>
{
    public void Configure(EntityTypeBuilder<DoctorSchedule> builder)
    {
        builder.ToTable("DoctorSchedules");

        builder.HasKey(schedule => schedule.Id);

        builder.Property(schedule => schedule.DayOfWeek)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(schedule => schedule.StartTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(schedule => schedule.EndTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(schedule => schedule.IsAvailable)
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(schedule => schedule.CreatedAtUtc)
            .IsRequired();

        builder.Property(schedule => schedule.UpdatedAtUtc)
            .IsRequired();

        builder.HasIndex(schedule => new
        {
            schedule.DoctorId,
            schedule.DayOfWeek,
            schedule.StartTime,
            schedule.EndTime
        }).IsUnique();
    }
}

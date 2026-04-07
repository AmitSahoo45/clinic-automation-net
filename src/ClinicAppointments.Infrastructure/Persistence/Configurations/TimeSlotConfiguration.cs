using ClinicAppointments.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinicAppointments.Infrastructure.Persistence.Configurations;

public class TimeSlotConfiguration : IEntityTypeConfiguration<TimeSlot>
{
    public void Configure(EntityTypeBuilder<TimeSlot> builder)
    {
        builder.ToTable("TimeSlots");

        builder.HasKey(timeSlot => timeSlot.Id);

        builder.Property(timeSlot => timeSlot.SlotDate)
            .HasColumnType("date")
            .IsRequired();

        builder.Property(timeSlot => timeSlot.StartTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(timeSlot => timeSlot.EndTime)
            .HasColumnType("time")
            .IsRequired();

        builder.Property(timeSlot => timeSlot.IsBooked)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(timeSlot => timeSlot.CreatedAtUtc)
            .IsRequired();

        builder.Property(timeSlot => timeSlot.UpdatedAtUtc)
            .IsRequired();

        builder.HasIndex(timeSlot => new
        {
            timeSlot.DoctorId,
            timeSlot.SlotDate,
            timeSlot.StartTime,
            timeSlot.EndTime
        }).IsUnique();

        builder.HasOne(timeSlot => timeSlot.DoctorSchedule)
            .WithMany(schedule => schedule.TimeSlots)
            .HasForeignKey(timeSlot => timeSlot.DoctorScheduleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

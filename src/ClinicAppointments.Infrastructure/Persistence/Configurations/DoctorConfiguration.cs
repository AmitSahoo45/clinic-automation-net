using ClinicAppointments.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinicAppointments.Infrastructure.Persistence.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.ToTable("Doctors");

        builder.HasKey(doctor => doctor.Id);

        builder.Property(doctor => doctor.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(doctor => doctor.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(doctor => doctor.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(doctor => doctor.PasswordHash)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(doctor => doctor.Specialization)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(doctor => doctor.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(doctor => doctor.Bio)
            .HasMaxLength(1500);

        builder.Property(doctor => doctor.CreatedAtUtc)
            .IsRequired();

        builder.Property(doctor => doctor.UpdatedAtUtc)
            .IsRequired();

        builder.HasIndex(doctor => doctor.Email)
            .IsUnique();

        builder.HasIndex(doctor => doctor.Specialization);

        builder.HasMany(doctor => doctor.Schedules)
            .WithOne(schedule => schedule.Doctor)
            .HasForeignKey(schedule => schedule.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(doctor => doctor.TimeSlots)
            .WithOne(timeSlot => timeSlot.Doctor)
            .HasForeignKey(timeSlot => timeSlot.DoctorId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}

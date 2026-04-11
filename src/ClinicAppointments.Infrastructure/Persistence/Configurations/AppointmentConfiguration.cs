using ClinicAppointments.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinicAppointments.Infrastructure.Persistence.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.ToTable("Appointments");

        builder.HasKey(appointment => appointment.Id);

        builder.Property(appointment => appointment.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(appointment => appointment.Notes)
            .HasMaxLength(1000);

        builder.Property(appointment => appointment.BookedAtUtc)
            .IsRequired();

        builder.Property(appointment => appointment.CreatedAtUtc)
            .IsRequired();

        builder.Property(appointment => appointment.UpdatedAtUtc)
            .IsRequired();

        builder.HasOne(appointment => appointment.Doctor)
            .WithMany(doctor => doctor.Appointments)
            .HasForeignKey(appointment => appointment.DoctorId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(appointment => appointment.Patient)
            .WithMany(patient => patient.Appointments)
            .HasForeignKey(appointment => appointment.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(appointment => appointment.TimeSlot)
            .WithMany(timeSlot => timeSlot.Appointments)
            .HasForeignKey(appointment => appointment.TimeSlotId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

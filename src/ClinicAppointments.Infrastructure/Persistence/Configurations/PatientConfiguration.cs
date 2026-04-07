using ClinicAppointments.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClinicAppointments.Infrastructure.Persistence.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.ToTable("Patients");

        builder.HasKey(patient => patient.Id);

        builder.Property(patient => patient.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(patient => patient.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(patient => patient.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(patient => patient.PasswordHash)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(patient => patient.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(patient => patient.CreatedAtUtc)
            .IsRequired();

        builder.Property(patient => patient.UpdatedAtUtc)
            .IsRequired();

        builder.HasIndex(patient => patient.Email)
            .IsUnique();
    }
}

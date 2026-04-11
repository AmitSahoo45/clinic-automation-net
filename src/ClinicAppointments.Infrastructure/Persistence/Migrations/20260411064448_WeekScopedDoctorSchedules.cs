using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicAppointments.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class WeekScopedDoctorSchedules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM [Appointments];
                DELETE FROM [TimeSlots];
                DELETE FROM [DoctorSchedules];
                """);

            migrationBuilder.DropIndex(
                name: "IX_DoctorSchedules_DoctorId_DayOfWeek_StartTime_EndTime",
                table: "DoctorSchedules");

            migrationBuilder.AddColumn<DateOnly>(
                name: "WeekStartDate",
                table: "DoctorSchedules",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "WeekStartDate",
                table: "DoctorSchedules",
                type: "date",
                nullable: false,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_DoctorId_WeekStartDate_DayOfWeek",
                table: "DoctorSchedules",
                columns: new[] { "DoctorId", "WeekStartDate", "DayOfWeek" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DoctorSchedules_DoctorId_WeekStartDate_DayOfWeek",
                table: "DoctorSchedules");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "WeekStartDate",
                table: "DoctorSchedules",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date");

            migrationBuilder.DropColumn(
                name: "WeekStartDate",
                table: "DoctorSchedules");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_DoctorId_DayOfWeek_StartTime_EndTime",
                table: "DoctorSchedules",
                columns: new[] { "DoctorId", "DayOfWeek", "StartTime", "EndTime" },
                unique: true);
        }
    }
}

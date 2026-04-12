using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicAppointments.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ScheduleSoftDeleteAndScheduleImpactHandling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DoctorSchedules_DoctorId_WeekStartDate_DayOfWeek",
                table: "DoctorSchedules");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "DoctorSchedules",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_DoctorId_WeekStartDate_DayOfWeek",
                table: "DoctorSchedules",
                columns: new[] { "DoctorId", "WeekStartDate", "DayOfWeek" },
                unique: true,
                filter: "[IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DoctorSchedules_DoctorId_WeekStartDate_DayOfWeek",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "DoctorSchedules");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_DoctorId_WeekStartDate_DayOfWeek",
                table: "DoctorSchedules",
                columns: new[] { "DoctorId", "WeekStartDate", "DayOfWeek" },
                unique: true);
        }
    }
}

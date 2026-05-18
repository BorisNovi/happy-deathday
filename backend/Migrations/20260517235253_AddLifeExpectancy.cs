using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HappyDeathdayApi.Migrations
{
    /// <inheritdoc />
    public partial class AddLifeExpectancy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LifeExpectancySettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CountryCode = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    Years = table.Column<double>(type: "double precision", nullable: false),
                    UpdatedAt = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LifeExpectancySettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "LifeExpectancySettings",
                columns: new[] { "Id", "CountryCode", "Gender", "UpdatedAt", "Years" },
                values: new object[,]
                {
                    { 1, "WW", "Male", new DateOnly(2023, 1, 1), 70.549999999999997 },
                    { 2, "WW", "Female", new DateOnly(2023, 1, 1), 75.890000000000001 },
                    { 3, "RU", "Male", new DateOnly(2023, 1, 1), 67.260000000000005 },
                    { 4, "RU", "Female", new DateOnly(2023, 1, 1), 79.040000000000006 },
                    { 5, "UA", "Male", new DateOnly(2023, 1, 1), 66.900000000000006 },
                    { 6, "UA", "Female", new DateOnly(2023, 1, 1), 80.200000000000003 },
                    { 7, "BY", "Male", new DateOnly(2023, 1, 1), 69.530000000000001 },
                    { 8, "BY", "Female", new DateOnly(2023, 1, 1), 79.060000000000002 },
                    { 9, "KZ", "Male", new DateOnly(2023, 1, 1), 70.109999999999999 },
                    { 10, "KZ", "Female", new DateOnly(2023, 1, 1), 78.390000000000001 },
                    { 11, "UZ", "Male", new DateOnly(2023, 1, 1), 69.450000000000003 },
                    { 12, "UZ", "Female", new DateOnly(2023, 1, 1), 75.400000000000006 },
                    { 13, "GE", "Male", new DateOnly(2023, 1, 1), 69.569999999999993 },
                    { 14, "GE", "Female", new DateOnly(2023, 1, 1), 79.109999999999999 },
                    { 15, "AM", "Male", new DateOnly(2023, 1, 1), 71.390000000000001 },
                    { 16, "AM", "Female", new DateOnly(2023, 1, 1), 79.450000000000003 },
                    { 17, "IL", "Male", new DateOnly(2023, 1, 1), 80.180000000000007 },
                    { 18, "IL", "Female", new DateOnly(2023, 1, 1), 84.590000000000003 },
                    { 19, "US", "Male", new DateOnly(2023, 1, 1), 76.859999999999999 },
                    { 20, "US", "Female", new DateOnly(2023, 1, 1), 81.849999999999994 },
                    { 21, "GB", "Male", new DateOnly(2023, 1, 1), 79.359999999999999 },
                    { 22, "GB", "Female", new DateOnly(2023, 1, 1), 83.209999999999994 },
                    { 23, "CA", "Male", new DateOnly(2023, 1, 1), 80.430000000000007 },
                    { 24, "CA", "Female", new DateOnly(2023, 1, 1), 84.829999999999998 },
                    { 25, "AU", "Male", new DateOnly(2023, 1, 1), 82.099999999999994 },
                    { 26, "AU", "Female", new DateOnly(2023, 1, 1), 85.739999999999995 },
                    { 27, "DE", "Male", new DateOnly(2023, 1, 1), 79.019999999999996 },
                    { 28, "DE", "Female", new DateOnly(2023, 1, 1), 83.760000000000005 },
                    { 29, "FR", "Male", new DateOnly(2023, 1, 1), 80.430000000000007 },
                    { 30, "FR", "Female", new DateOnly(2023, 1, 1), 86.090000000000003 },
                    { 31, "PL", "Male", new DateOnly(2023, 1, 1), 74.879999999999995 },
                    { 32, "PL", "Female", new DateOnly(2023, 1, 1), 82.349999999999994 },
                    { 33, "ES", "Male", new DateOnly(2023, 1, 1), 80.959999999999994 },
                    { 34, "ES", "Female", new DateOnly(2023, 1, 1), 86.310000000000002 },
                    { 35, "IT", "Male", new DateOnly(2023, 1, 1), 81.569999999999993 },
                    { 36, "IT", "Female", new DateOnly(2023, 1, 1), 85.75 },
                    { 37, "NL", "Male", new DateOnly(2023, 1, 1), 80.540000000000006 },
                    { 38, "NL", "Female", new DateOnly(2023, 1, 1), 83.739999999999995 },
                    { 39, "RS", "Male", new DateOnly(2023, 1, 1), 73.5 },
                    { 40, "RS", "Female", new DateOnly(2023, 1, 1), 80.040000000000006 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_LifeExpectancySettings_CountryCode_Gender",
                table: "LifeExpectancySettings",
                columns: new[] { "CountryCode", "Gender" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LifeExpectancySettings");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HappyDeathdayApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAsianCountries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "LifeExpectancySettings",
                columns: new[] { "Id", "CountryCode", "Gender", "UpdatedAt", "Years" },
                values: new object[,]
                {
                    { 41, "CN", "Male", new DateOnly(2023, 1, 1), 75.0 },
                    { 42, "CN", "Female", new DateOnly(2023, 1, 1), 80.5 },
                    { 43, "JP", "Male", new DateOnly(2023, 1, 1), 81.049999999999997 },
                    { 44, "JP", "Female", new DateOnly(2023, 1, 1), 87.090000000000003 },
                    { 45, "KR", "Male", new DateOnly(2023, 1, 1), 79.900000000000006 },
                    { 46, "KR", "Female", new DateOnly(2023, 1, 1), 85.599999999999994 },
                    { 47, "SG", "Male", new DateOnly(2023, 1, 1), 81.5 },
                    { 48, "SG", "Female", new DateOnly(2023, 1, 1), 85.900000000000006 },
                    { 49, "VN", "Male", new DateOnly(2023, 1, 1), 71.099999999999994 },
                    { 50, "VN", "Female", new DateOnly(2023, 1, 1), 76.299999999999997 },
                    { 51, "TH", "Male", new DateOnly(2023, 1, 1), 71.0 },
                    { 52, "TH", "Female", new DateOnly(2023, 1, 1), 78.5 },
                    { 53, "MY", "Male", new DateOnly(2023, 1, 1), 72.5 },
                    { 54, "MY", "Female", new DateOnly(2023, 1, 1), 77.099999999999994 },
                    { 55, "ID", "Male", new DateOnly(2023, 1, 1), 69.5 },
                    { 56, "ID", "Female", new DateOnly(2023, 1, 1), 73.5 },
                    { 57, "PH", "Male", new DateOnly(2023, 1, 1), 66.0 },
                    { 58, "PH", "Female", new DateOnly(2023, 1, 1), 73.0 },
                    { 59, "IN", "Male", new DateOnly(2023, 1, 1), 67.5 },
                    { 60, "IN", "Female", new DateOnly(2023, 1, 1), 70.200000000000003 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 51);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 52);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 53);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 54);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 55);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 56);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 57);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 58);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 59);

            migrationBuilder.DeleteData(
                table: "LifeExpectancySettings",
                keyColumn: "Id",
                keyValue: 60);
        }
    }
}

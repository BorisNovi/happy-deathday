using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HappyDeathdayApi.Migrations
{
    /// <inheritdoc />
    public partial class AddDeathDateToCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "ExpectedDeathDate",
                table: "Cards",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<double>(
                name: "LifeExpectancyYears",
                table: "Cards",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpectedDeathDate",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "LifeExpectancyYears",
                table: "Cards");
        }
    }
}

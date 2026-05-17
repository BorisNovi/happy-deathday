using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HappyDeathdayApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCardEnumsAndLang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Cards",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Lang",
                table: "Cards",
                type: "character varying(2)",
                maxLength: 2,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Style",
                table: "Cards",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Lang",
                table: "Cards");

            migrationBuilder.DropColumn(
                name: "Style",
                table: "Cards");
        }
    }
}

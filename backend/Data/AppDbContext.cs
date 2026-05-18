using HappyDeathdayApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HappyDeathdayApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Card> Cards => Set<Card>();
    public DbSet<LifeExpectancySetting> LifeExpectancySettings => Set<LifeExpectancySetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Card>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.RecipientName).HasMaxLength(100).IsRequired();
            e.Property(c => c.Lang).HasMaxLength(2).IsRequired();
            e.Property(c => c.CountryCode).HasConversion<string>().IsRequired();
            e.Property(c => c.Gender).HasConversion<string>().IsRequired();
            e.Property(c => c.Style).HasConversion<string>().IsRequired();
            e.Property(c => c.CreatedAt).IsRequired();
            e.Property(c => c.ExpiresAt).IsRequired();
            e.HasIndex(c => c.ExpiresAt);
        });

        modelBuilder.Entity<LifeExpectancySetting>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.CountryCode).HasConversion<string>().IsRequired();
            e.Property(x => x.Gender).HasConversion<string>().IsRequired();
            e.HasIndex(x => new { x.CountryCode, x.Gender }).IsUnique();
            e.HasData(SeedLifeExpectancy());
        });
    }

    private static LifeExpectancySetting[] SeedLifeExpectancy()
    {
        var updatedAt = new DateOnly(2023, 1, 1);
        var id = 1;
        LifeExpectancySetting Row(CountryCode country, CardGender gender, double years) =>
            new() { Id = id++, CountryCode = country, Gender = gender, Years = years, UpdatedAt = updatedAt };

        return
        [
            Row(CountryCode.WW, CardGender.Male,   70.55),
            Row(CountryCode.WW, CardGender.Female, 75.89),

            Row(CountryCode.RU, CardGender.Male,   67.26),
            Row(CountryCode.RU, CardGender.Female, 79.04),

            Row(CountryCode.UA, CardGender.Male,   66.90),
            Row(CountryCode.UA, CardGender.Female, 80.20),

            Row(CountryCode.BY, CardGender.Male,   69.53),
            Row(CountryCode.BY, CardGender.Female, 79.06),

            Row(CountryCode.KZ, CardGender.Male,   70.11),
            Row(CountryCode.KZ, CardGender.Female, 78.39),

            Row(CountryCode.UZ, CardGender.Male,   69.45),
            Row(CountryCode.UZ, CardGender.Female, 75.40),

            Row(CountryCode.GE, CardGender.Male,   69.57),
            Row(CountryCode.GE, CardGender.Female, 79.11),

            Row(CountryCode.AM, CardGender.Male,   71.39),
            Row(CountryCode.AM, CardGender.Female, 79.45),

            Row(CountryCode.IL, CardGender.Male,   80.18),
            Row(CountryCode.IL, CardGender.Female, 84.59),

            Row(CountryCode.US, CardGender.Male,   76.86),
            Row(CountryCode.US, CardGender.Female, 81.85),

            Row(CountryCode.GB, CardGender.Male,   79.36),
            Row(CountryCode.GB, CardGender.Female, 83.21),

            Row(CountryCode.CA, CardGender.Male,   80.43),
            Row(CountryCode.CA, CardGender.Female, 84.83),

            Row(CountryCode.AU, CardGender.Male,   82.10),
            Row(CountryCode.AU, CardGender.Female, 85.74),

            Row(CountryCode.DE, CardGender.Male,   79.02),
            Row(CountryCode.DE, CardGender.Female, 83.76),

            Row(CountryCode.FR, CardGender.Male,   80.43),
            Row(CountryCode.FR, CardGender.Female, 86.09),

            Row(CountryCode.PL, CardGender.Male,   74.88),
            Row(CountryCode.PL, CardGender.Female, 82.35),

            Row(CountryCode.ES, CardGender.Male,   80.96),
            Row(CountryCode.ES, CardGender.Female, 86.31),

            Row(CountryCode.IT, CardGender.Male,   81.57),
            Row(CountryCode.IT, CardGender.Female, 85.75),

            Row(CountryCode.NL, CardGender.Male,   80.54),
            Row(CountryCode.NL, CardGender.Female, 83.74),

            Row(CountryCode.RS, CardGender.Male,   73.50),
            Row(CountryCode.RS, CardGender.Female, 80.04),
        ];
    }
}

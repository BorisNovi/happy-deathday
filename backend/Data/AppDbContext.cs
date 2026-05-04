using HappyDeathdayApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HappyDeathdayApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Card> Cards => Set<Card>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Card>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.RecipientName).HasMaxLength(100).IsRequired();
            e.Property(c => c.CreatedAt).IsRequired();
            e.Property(c => c.ExpiresAt).IsRequired();
            e.HasIndex(c => c.ExpiresAt);
        });
    }
}

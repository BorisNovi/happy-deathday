using HappyDeathdayApi.Data;
using Microsoft.EntityFrameworkCore;

namespace HappyDeathdayApi.Infrastructure;

public class CardCleanupService(
    IServiceScopeFactory scopeFactory,
    ILogger<CardCleanupService> logger) : BackgroundService
{
    private readonly TimeSpan _interval = TimeSpan.FromHours(1);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            await CleanupExpiredCardsAsync(cancellationToken);
            await Task.Delay(_interval, cancellationToken);
        }
    }

    private async Task CleanupExpiredCardsAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var deleted = await db.Cards
            .Where(c => c.ExpiresAt < DateTime.UtcNow)
            .ExecuteDeleteAsync(cancellationToken);

        if (deleted > 0)
            logger.LogInformation("Deleted {Count} expired cards", deleted);
    }
}

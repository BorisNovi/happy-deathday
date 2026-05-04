using HappyDeathdayApi.Models;

namespace HappyDeathdayApi.Dtos;

public record CardResponse(
    Guid Id,
    string RecipientName,
    DateOnly BirthDate,
    DateTime CreatedAt,
    DateTime ExpiresAt
)
{
    public static CardResponse FromCard(Card card) => new(
        card.Id,
        card.RecipientName,
        card.BirthDate,
        card.CreatedAt,
        card.ExpiresAt
    );
}

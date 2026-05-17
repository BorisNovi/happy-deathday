using HappyDeathdayApi.Models;

namespace HappyDeathdayApi.Dtos;

public record CardResponse(
    Guid Id,
    string RecipientName,
    DateOnly BirthDate,
    string Lang,
    CardGender Gender,
    CardStyle Style,
    DateTime CreatedAt,
    DateTime ExpiresAt
)
{
    public static CardResponse FromCard(Card card) => new(
        card.Id,
        card.RecipientName,
        card.BirthDate,
        card.Lang,
        card.Gender,
        card.Style,
        card.CreatedAt,
        card.ExpiresAt
    );
}

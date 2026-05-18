using HappyDeathdayApi.Models;

namespace HappyDeathdayApi.Dtos;

public record CardResponse(
    Guid Id,
    string RecipientName,
    DateOnly BirthDate,
    string Lang,
    CountryCode CountryCode,
    CardGender Gender,
    CardStyle Style,
    DateOnly ExpectedDeathDate,
    double LifeExpectancyYears,
    DateTime CreatedAt,
    DateTime ExpiresAt
)
{
    public static CardResponse FromCard(Card card) => new(
        card.Id,
        card.RecipientName,
        card.BirthDate,
        card.Lang,
        card.CountryCode,
        card.Gender,
        card.Style,
        card.ExpectedDeathDate,
        card.LifeExpectancyYears,
        card.CreatedAt,
        card.ExpiresAt
    );
}

namespace HappyDeathdayApi.Models;

public class Card
{
    public Guid Id { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public DateOnly BirthDate { get; set; }
    public string Lang { get; set; } = "en";
    public CountryCode CountryCode { get; set; }
    public CardGender Gender { get; set; }
    public CardStyle Style { get; set; }
    public DateOnly ExpectedDeathDate { get; set; }
    public double LifeExpectancyYears { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}

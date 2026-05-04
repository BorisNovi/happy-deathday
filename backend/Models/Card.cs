namespace HappyDeathdayApi.Models;

public class Card
{
    public Guid Id { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public DateOnly BirthDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
}

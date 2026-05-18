namespace HappyDeathdayApi.Models;

public class LifeExpectancySetting
{
    public int Id { get; set; }
    public CountryCode CountryCode { get; set; }
    public CardGender Gender { get; set; }
    public double Years { get; set; }
    public DateOnly UpdatedAt { get; set; }
}

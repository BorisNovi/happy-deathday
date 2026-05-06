using System.ComponentModel.DataAnnotations;

namespace HappyDeathdayApi.Infrastructure;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Parameter)]
public class PastDateAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is DateOnly date)
            return date < DateOnly.FromDateTime(DateTime.UtcNow);

        return false;
    }

    public override string FormatErrorMessage(string name)
        => $"{name} must be a date in the past.";
}

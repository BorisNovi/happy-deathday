namespace HappyDeathdayApi.Dtos;

public record CardPreviewResponse(
    DateOnly ExpectedDeathDate,
    double LifeExpectancyYears,
    int YearsRemaining
);

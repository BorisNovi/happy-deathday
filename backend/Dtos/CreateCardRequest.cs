using System.ComponentModel.DataAnnotations;

namespace HappyDeathdayApi.Dtos;

public record CreateCardRequest(
    [Required, MaxLength(100)] string RecipientName,
    DateOnly BirthDate
);

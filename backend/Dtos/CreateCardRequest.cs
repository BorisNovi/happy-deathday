using System.ComponentModel.DataAnnotations;
using HappyDeathdayApi.Infrastructure;

namespace HappyDeathdayApi.Dtos;

public record CreateCardRequest(
    [Required, MaxLength(100)] string RecipientName,
    [Required, PastDate] DateOnly BirthDate
);

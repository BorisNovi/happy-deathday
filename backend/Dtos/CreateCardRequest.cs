using System.ComponentModel.DataAnnotations;
using HappyDeathdayApi.Infrastructure;
using HappyDeathdayApi.Models;

namespace HappyDeathdayApi.Dtos;

public record CreateCardRequest(
    [Required, MaxLength(100)] string RecipientName,
    [Required, PastDate] DateOnly? BirthDate,
    [Required, MaxLength(2)] string Lang,
    [Required] CardGender? Gender,
    [Required] CardStyle? Style
);

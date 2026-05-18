using System.ComponentModel.DataAnnotations;
using HappyDeathdayApi.Data;
using HappyDeathdayApi.Dtos;
using HappyDeathdayApi.Infrastructure;
using HappyDeathdayApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace HappyDeathdayApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    [EnableRateLimiting("create")]
    public async Task<IActionResult> Create(CreateCardRequest request)
    {
        var country = request.CountryCode ?? CountryCode.WW;
        var gender = request.Gender!.Value;

        var expectancy = await db.LifeExpectancySettings
            .FirstOrDefaultAsync(x => x.CountryCode == country && x.Gender == gender);

        if (expectancy is null)
            return NotFound();

        var now = DateTime.UtcNow;
        var card = new Card
        {
            Id = Guid.NewGuid(),
            RecipientName = request.RecipientName,
            BirthDate = request.BirthDate!.Value,
            Lang = request.Lang,
            CountryCode = country,
            Gender = gender,
            Style = request.Style!.Value,
            ExpectedDeathDate = request.BirthDate!.Value.AddYears((int)expectancy.Years),
            LifeExpectancyYears = expectancy.Years,
            CreatedAt = now,
            ExpiresAt = now.AddDays(7)
        };

        db.Cards.Add(card);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = card.Id }, CardResponse.FromCard(card));
    }

    [HttpGet("preview")]
    [EnableRateLimiting("read")]
    public async Task<IActionResult> Preview(
        [FromQuery, Required, PastDate] DateOnly? birthDate,
        [FromQuery] CountryCode? countryCode,
        [FromQuery, Required] CardGender? gender)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var country = countryCode ?? CountryCode.WW;

        var expectancy = await db.LifeExpectancySettings
            .FirstOrDefaultAsync(x => x.CountryCode == country && x.Gender == gender!.Value);

        if (expectancy is null)
            return NotFound();

        var deathDate = birthDate!.Value.AddYears((int)expectancy.Years);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var yearsRemaining = deathDate.Year - today.Year;

        return Ok(new CardPreviewResponse(deathDate, expectancy.Years, yearsRemaining));
    }

    [HttpGet("{id:guid}")]
    [EnableRateLimiting("read")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var card = await db.Cards.FindAsync(id);
        if (card is null)
            return NotFound();

        return Ok(CardResponse.FromCard(card));
    }

    // TODO: метод для дебага, потому перенести в админку или удалить
    [HttpGet]
    public async Task<IActionResult> GetList()
    {
        var cards = await db.Cards.ToListAsync();
        return Ok(cards.Select(CardResponse.FromCard));
    }
}

using HappyDeathdayApi.Data;
using HappyDeathdayApi.Dtos;
using HappyDeathdayApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HappyDeathdayApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(CreateCardRequest request)
    {
        var now = DateTime.UtcNow;
        var card = new Card
        {
            Id = Guid.NewGuid(),
            RecipientName = request.RecipientName,
            BirthDate = request.BirthDate!.Value,
            Lang = request.Lang,
            Gender = request.Gender!.Value,
            Style = request.Style!.Value,
            CreatedAt = now,
            ExpiresAt = now.AddDays(7)
        };

        db.Cards.Add(card);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = card.Id }, CardResponse.FromCard(card));
    }

    [HttpGet("{id:guid}")]
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

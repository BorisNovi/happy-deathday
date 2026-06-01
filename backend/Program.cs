using System.Text.Json;
using System.Text.Json.Serialization;
using HappyDeathdayApi.Data;
using HappyDeathdayApi.Extensions;
using HappyDeathdayApi.Infrastructure;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddHostedService<CardCleanupService>();
builder.Services.AddProblemDetails();

builder.Services.AddCorsPolicy(builder.Configuration);
builder.Services.AddRateLimiting();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseForwardedHeaders();
app.UseExceptionHandler();
app.UseCors();
app.UseRateLimiter();

app.MapControllers();
app.MapGet("/api/version", () => Environment.GetEnvironmentVariable("APP_VERSION") ?? "dev");

app.Run();

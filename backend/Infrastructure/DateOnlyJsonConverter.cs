using System.Text.Json;
using System.Text.Json.Serialization;

namespace HappyDeathdayApi.Infrastructure;

public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var str = reader.GetString();
        if (DateOnly.TryParse(str, out var date))
            return date;
        if (DateTimeOffset.TryParse(str, out var dto))
            return DateOnly.FromDateTime(dto.UtcDateTime);
        throw new JsonException($"Cannot convert '{str}' to DateOnly.");
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.ToString("yyyy-MM-dd"));
}

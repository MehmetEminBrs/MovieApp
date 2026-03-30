using System.Text.Json;

namespace MovieApp.API.Services;

public class JsonService
{
    public List<T> Read<T>(string path)
    {
        if (!File.Exists(path))
            return new List<T>();

        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
    }

    public void Write<T>(string path, List<T> data)
    {
        var json = JsonSerializer.Serialize(data, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText(path, json);
    }
}
using System.Text.Json;
using MovieApp.API.Models;

public class ActorService
{
    private readonly string _filePath = "Data/actors.json";
    private List<Actor> _actors;

    public ActorService()
    {
        if (File.Exists(_filePath))
        {
            var json = File.ReadAllText(_filePath);
            _actors = JsonSerializer.Deserialize<List<Actor>>(json) ?? new List<Actor>();
        }
        else
        {
            _actors = new List<Actor>();
            File.WriteAllText(_filePath, "[]");
        }
    }

    public List<Actor> GetAll() => _actors;

    public Actor? GetById(int id) => _actors.FirstOrDefault(a => a.Id == id);

    public Actor Add(Actor actor)
    {
        actor.Id = _actors.Any() ? _actors.Max(a => a.Id) + 1 : 1;

        _actors.Add(actor);
        Save();

        return actor;
    }

    public Actor? Update(Actor updatedActor)
    {
        var actor = _actors.FirstOrDefault(a => a.Id == updatedActor.Id);
        if (actor == null) return null;

        actor.Name = updatedActor.Name;
        actor.Description = updatedActor.Description;
        actor.ImageUrl = updatedActor.ImageUrl;

        Save();
        return actor;
    }

    public bool Delete(int id)
    {
        var actor = _actors.FirstOrDefault(a => a.Id == id);
        if (actor == null) return false;

        if (!string.IsNullOrEmpty(actor.ImageUrl))
        {
            var filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                actor.ImageUrl.TrimStart('/')
            );

            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        _actors.Remove(actor);
        Save();

        return true;
    }

    private void Save()
    {
        var json = JsonSerializer.Serialize(_actors, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText(_filePath, json);
    }
}
using System.Text.Json;
using MovieApp.API.Models;

public class MovieService
{
    private readonly string _filePath = "Data/movies.json";
    private List<Movie> _movies;

    public MovieService()
    {
        if (File.Exists(_filePath))
        {
            var json = File.ReadAllText(_filePath);
            _movies = JsonSerializer.Deserialize<List<Movie>>(json) ?? new List<Movie>();
        }
        else
        {
            _movies = new List<Movie>();
            File.WriteAllText(_filePath, "[]");
        }
    }

    public List<Movie> GetAll() => _movies;

    public Movie? GetById(int id) => _movies.FirstOrDefault(m => m.Id == id);

    public Movie Add(Movie movie)
    {
        movie.Id = _movies.Any() ? _movies.Max(m => m.Id) + 1 : 1;

        _movies.Add(movie);
        Save();

        return movie;
    }

    public Movie? Update(Movie updatedMovie)
    {
        var movie = _movies.FirstOrDefault(m => m.Id == updatedMovie.Id);
        if (movie == null) return null;

        movie.Title = updatedMovie.Title;
        movie.Description = updatedMovie.Description;
        movie.ReleaseYear = updatedMovie.ReleaseYear;
        movie.ImdbRating = updatedMovie.ImdbRating;
        movie.ImageUrl = updatedMovie.ImageUrl;

        movie.Actors = updatedMovie.Actors ?? new List<MovieActor>();

        Save();
        return movie;
    }

    public bool Delete(int id)
    {
        var movie = _movies.FirstOrDefault(m => m.Id == id);
        if (movie == null) return false;

        if (!string.IsNullOrEmpty(movie.ImageUrl))
        {
            var filePath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                movie.ImageUrl.TrimStart('/')
            );

            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        _movies.Remove(movie);
        Save();

        return true;
    }

    private void Save()
    {
        var json = JsonSerializer.Serialize(_movies, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText(_filePath, json);
    }
}
namespace MovieApp.API.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int ReleaseYear { get; set; }
    public double ImdbRating { get; set; }
    public string ImageUrl { get; set; }

    public List<MovieActor> Actors { get; set; } = new();
}
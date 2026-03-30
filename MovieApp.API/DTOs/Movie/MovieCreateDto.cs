using Microsoft.AspNetCore.Http;

namespace MovieApp.API.DTOs;

public class MovieCreateDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int ReleaseYear { get; set; }
    public double ImdbRating { get; set; }
    public IFormFile? Image { get; set; }
}
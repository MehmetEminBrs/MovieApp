using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieApp.API.Models;
using MovieApp.API.DTOs;
using System.Text.Json;

namespace MovieApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MovieController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly MovieService _movieService;

    public MovieController(IWebHostEnvironment env, MovieService movieService)
    {
        _env = env;
        _movieService = movieService;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_movieService.GetAll());

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var movie = _movieService.GetById(id);
        if (movie == null) return NotFound();
        return Ok(movie);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public IActionResult Create([FromForm] MovieCreateDto dto, [FromForm] string actorsJson)
    {
        var actorsList = ParseActors(actorsJson);
        if (actorsList == null)
            return BadRequest("Invalid actors JSON");

        var movie = new Movie
        {
            Title = dto.Title,
            Description = dto.Description,
            ReleaseYear = dto.ReleaseYear,
            ImdbRating = dto.ImdbRating,
            Actors = actorsList.Select(a => new MovieActor
            {
                ActorId = a.ActorId,
                CharacterName = a.CharacterName
            }).ToList()
        };

        if (dto.Image != null)
        {
            var validation = ValidateImage(dto.Image);
            if (validation != null) return validation;

            var fileName = SaveFile(dto.Image);
            movie.ImageUrl = $"/uploads/{fileName}";
        }

        return Ok(_movieService.Add(movie));
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromForm] MovieCreateDto dto, [FromForm] string actorsJson)
    {
        var movie = _movieService.GetById(id);
        if (movie == null) return NotFound();

        var actorsList = ParseActors(actorsJson);
        if (actorsList == null)
            return BadRequest("Invalid actors JSON");

        movie.Title = dto.Title;
        movie.Description = dto.Description;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.ImdbRating = dto.ImdbRating;
        movie.Actors = actorsList.Select(a => new MovieActor
        {
            ActorId = a.ActorId,
            CharacterName = a.CharacterName
        }).ToList();

        if (dto.Image != null)
        {
            var validation = ValidateImage(dto.Image);
            if (validation != null) return validation;

            if (!string.IsNullOrEmpty(movie.ImageUrl))
            {
                var safeName = movie.ImageUrl.Replace("/uploads/", "");
                var oldPath = Path.Combine(GetUploadPath(), safeName);

                if (System.IO.File.Exists(oldPath))
                    System.IO.File.Delete(oldPath);
            }

            var fileName = SaveFile(dto.Image);
            movie.ImageUrl = $"/uploads/{fileName}";
        }

        _movieService.Update(movie);
        return Ok(movie);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deleted = _movieService.Delete(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    private List<MovieActorDto>? ParseActors(string json)
    {
        try
        {
            return string.IsNullOrEmpty(json)
                ? new List<MovieActorDto>()
                : JsonSerializer.Deserialize<List<MovieActorDto>>(json);
        }
        catch
        {
            return null;
        }
    }

    private IActionResult? ValidateImage(IFormFile file)
    {
        var allowed = new[] { ".jpg", ".jpeg", ".png" };
        var ext = Path.GetExtension(file.FileName).ToLower();

        if (!allowed.Contains(ext))
            return BadRequest("Invalid file type");

        if (file.Length > 2 * 1024 * 1024)
            return BadRequest("File too large");

        return null;
    }

    private string SaveFile(IFormFile file)
    {
        var folder = GetUploadPath();
        Directory.CreateDirectory(folder);

        var safeName = Path.GetFileName(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{safeName}";
        var path = Path.Combine(folder, fileName);

        using var stream = new FileStream(path, FileMode.Create);
        file.CopyTo(stream);

        return fileName;
    }

    private string GetUploadPath()
    {
        return Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
    }
}
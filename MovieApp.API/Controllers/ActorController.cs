using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieApp.API.DTOs;
using MovieApp.API.Models;

namespace MovieApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActorController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly ActorService _actorService;

    public ActorController(IWebHostEnvironment env, ActorService actorService)
    {
        _env = env;
        _actorService = actorService;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_actorService.GetAll());

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var actor = _actorService.GetById(id);
        if (actor == null) return NotFound();

        return Ok(actor);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public IActionResult Create([FromForm] ActorCreateDto dto)
    {
        var actor = new Actor
        {
            Name = dto.Name,
            Description = dto.Description
        };

        if (dto.Image != null)
        {
            var validationResult = ValidateImage(dto.Image);
            if (validationResult != null)
                return validationResult;

            var fileName = SaveFile(dto.Image);
            actor.ImageUrl = $"/uploads/{fileName}";
        }

        var addedActor = _actorService.Add(actor);
        return Ok(addedActor);
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromForm] ActorCreateDto dto)
    {
        var actor = _actorService.GetById(id);
        if (actor == null) return NotFound();

        actor.Name = dto.Name;
        actor.Description = dto.Description;

        if (dto.Image != null)
        {
            var validationResult = ValidateImage(dto.Image);
            if (validationResult != null)
                return validationResult;

            if (!string.IsNullOrEmpty(actor.ImageUrl))
            {
                var safePath = actor.ImageUrl.Replace("/uploads/", "");
                var oldFilePath = Path.Combine(GetUploadPath(), safePath);

                if (System.IO.File.Exists(oldFilePath))
                    System.IO.File.Delete(oldFilePath);
            }

            var fileName = SaveFile(dto.Image);
            actor.ImageUrl = $"/uploads/{fileName}";
        }

        _actorService.Update(actor);
        return Ok(actor);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deleted = _actorService.Delete(id);
        if (!deleted) return NotFound();

        return NoContent();
    }

    private IActionResult? ValidateImage(IFormFile file)
    {
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
        var extension = Path.GetExtension(file.FileName).ToLower();

        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type");

        if (file.Length > 2 * 1024 * 1024)
            return BadRequest("File too large");

        return null;
    }

    private string SaveFile(IFormFile file)
    {
        var uploadsFolder = GetUploadPath();
        Directory.CreateDirectory(uploadsFolder);

        var safeFileName = Path.GetFileName(file.FileName);
        var fileName = $"{Guid.NewGuid()}_{safeFileName}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        file.CopyTo(stream);

        return fileName;
    }

    private string GetUploadPath()
    {
        return Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
    }
}
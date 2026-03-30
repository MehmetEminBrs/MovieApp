using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace MovieApp.API.DTOs;

public class ActorCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public IFormFile? Image { get; set; }
}
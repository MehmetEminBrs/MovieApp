using Microsoft.AspNetCore.Http;

namespace MovieApp.API.DTOs;

public class MovieActorDto
{
    public int ActorId { get; set; }
    public string CharacterName { get; set; }
}
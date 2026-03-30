using MovieApp.API.Models;
using BCrypt.Net;

namespace MovieApp.API.Services;

public class UserService
{
    private readonly List<User> _users = new();

    public User GetByUsername(string username) =>
        _users.FirstOrDefault(x => x.Username == username);

    public int NextUserId() => _users.Any() ? _users.Max(u => u.Id) + 1 : 1;

    public void AddUser(User user)
    {
        if (!_users.Any())
            user.Role = "admin";
        else
            user.Role = "user";

        _users.Add(user);
    }

     public User GetById(int id)
    {
        return _users.FirstOrDefault(x => x.Id == id);
    }

    public List<User> GetAllUsers() => _users;
}
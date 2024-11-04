using System;


namespace backend_module.Models.User
{
    public class UserDto
    {
        
    public string Nif { get; set; }

    public string Email { get; set; }

    public string UserName { get; set; }

    public string PhoneNumber { get; set; }

    public RoleType Role { get; set; }


     public UserDto(string nif, string email, string username, string phone, RoleType role) {
            Nif = nif;
            Email = email;
            UserName = username;
            PhoneNumber = phone;
            Role = role;
    }

    public UserDto(string email, string username, string phone, RoleType role) {
            Email = email;
            UserName = username;
            PhoneNumber = phone;
            Role = role;
    }

    public UserDto(){}

    }
}
using System;


namespace sem5pi_24_25_g051.Models.User
{
    public class UserDto
    {

    public string Nif { get; set; }

    public string Email { get; set; }

    public string UserName { get; set; }

    public string PhoneNumber { get; set; }

    public UserRole Role { get; set; }


     public UserDto(string nif,string email, string username, string phone, UserRole role ) {
            Nif = nif;
            Email = email;
            UserName = username;
            PhoneNumber = phone;
            Role = role;
        }

        public UserDto(){}

    }
}
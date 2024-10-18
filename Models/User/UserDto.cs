using System;


namespace sem5pi_24_25_g051.Models.User
{
   public class UserDto
{
    public string Id { get; set; }

    public string Email { get; set; }

    public string UserName { get; set; }

    public string PhoneNumber { get; set; }

    public UserRole Role { get; set; }

    public UserNif Nif { get; set; }

    // Do not include Password in DTOs for security reasons
}
}
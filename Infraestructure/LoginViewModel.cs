using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Infraestructure;
public class LoginViewModel
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public required string Password { get; set; }

    public bool RememberMe { get; set; }
}


using System.ComponentModel.DataAnnotations;
using sem5pi_24_25_g051.Domain.User;

namespace sem5pi_24_25_g051.Infraestructure;

public class RegisterBackofficeUserViewModel
{
      [Key]
        public int Id { get; private set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required UserRole Role { get;  set; }
        [Required]
        [Phone]
        public required string Phone {get; set;}

}



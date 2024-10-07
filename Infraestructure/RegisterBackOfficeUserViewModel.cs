
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Infraestructure;

public class RegisterBackofficeUserViewModel
{
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Role { get; set; }
        [Required]
        [Phone]
        public required string Phone {get;set;}  
}



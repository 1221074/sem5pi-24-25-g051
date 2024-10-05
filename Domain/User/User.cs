using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.User
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; }
   
        public string Username { get; set; }

        public string Role { get; set; }
    }
}

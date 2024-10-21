using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.User
{
    public class User : Entity<UserId>
    {
        [Required]
        [NotMapped]
        public UserRole Role { get;  set; }
        [Required]
        public UserPassword Password {get;  set; }
        [Required]
        public UserNif Nif { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Phone { get; set; }

        [Required]
        public string Email{get;set;}

        public static readonly Regex MailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");

        protected User() {}

        public User(UserNif nif,string email, string username, string phoneNumber, UserRole role) {
            if (!EmailVerification(email)) {
                throw new ArgumentException("Email inválido", nameof(email));
            }
            Email = email;
            Role = role;
            Nif = nif;
            Password = new UserPassword();
            Username = username;       
            Phone = phoneNumber;
        }

            public bool Active { get; set; } = true;

    public void MarkAsInactive()
    {
        this.Active = false;
    }

        public static bool EmailVerification(string mail) {
             if (string.IsNullOrEmpty(mail)){
            return false;
            }

            // Regex to check if email is valid
            if (!MailRegex.IsMatch(mail))
            {
                return false;
            }
            return true;
        }
    }
}

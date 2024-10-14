using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Identity;

namespace sem5pi_24_25_g051.Models
{
    public class User : IdentityUser
    {
        [Required]
        public UserRole Role { get;  set; }
        [Required]
        public UserPassword Password {get;  set; }

        [Required]
        [Key]
        public UserNif Nif { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Phone { get; set; }

        public static readonly Regex MailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");

        protected User() {}

        public User(string email, string username, string phoneNumber, UserRole role, string nif, string password) {
            if (!EmailVerification(email)) {
                throw new ArgumentException("Email inválido", nameof(email));
            }
            Email = email;
            Role = role;
            Nif = new UserNif(nif);
            Password = new UserPassword(password);
            Username = username;       
            Phone = phoneNumber;
            
        }


   
        public static bool EmailVerification(string mail) {
             if (string.IsNullOrEmpty(mail)){
            return false;
            }
            string[] emailParts = mail.Split("@");
            if (emailParts[1] == null)
            {
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

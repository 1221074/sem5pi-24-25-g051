using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.User
{
    public class User : Entity<UserNif>
    {
       public string Email{get;set;}
       public string Username { get; set; }
       public string Phone { get; set; }
       public RoleType Role { get;  set; }
       public UserPassword Password {get;  set; }

       public static readonly Regex MailRegex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");

        private User() {
            this.Active = true;
        }

        public User(string email, string username, string phoneNumber, RoleType role,string nif) {
            if (!EmailVerification(email)) {
                throw new ArgumentException("Email Inválido", nameof(email));
            }
            Id = new UserNif(nif);
            Email = email;
            Role = role;
            Password = new UserPassword();
            Username = username; 
            Phone = phoneNumber;
            Active = false;
        }

        public bool Active { get; set; }

        public void MarkAsInactive()
        {
        this.Active = false;
        }

        public void MarkAsActive() {
            this.Active = true;
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

        public void Change(string email, string username, string phoneNumber, RoleType role)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive category.");
            this.Email = email;
            this.Username = username;
            this.Phone = phoneNumber;
            this.Role = role;
        }
    }
}

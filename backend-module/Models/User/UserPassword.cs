
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Storage.Internal;
namespace backend_module.Models.User;

public class UserPassword  {
        [Required]
        [Key]
        public string Value { get; private set; }

        public UserPassword() {
            //generate random password that meets the criteria
            Value = PasswordPolicy.GenerateRandomPassword();
        }

        public UserPassword(string password)
        {
            if (!PasswordPolicy.IsValidPassword(password))
            {
                throw new ArgumentException("Password does not meet the password policy");
            }
            Value = password;

        }

}

using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Storage.Internal;
namespace sem5pi_24_25_g051.Models;

public class UserPassword  {
        [Required]
        [Key]
        public string Value { get; private set; }

        protected UserPassword() {}

        public UserPassword(string password)
        {
            if (!PasswordPolicy.IsValidPassword(password))
            {
                throw new ArgumentException("Password does not meet the password policy");
            }
            Value = password;

        }

}
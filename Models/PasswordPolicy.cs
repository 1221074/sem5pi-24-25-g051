using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace sem5pi_24_25_g051.Models;

public class PasswordPolicy
{
    private static readonly int MIN_LENGTH = 10;
 
    protected PasswordPolicy() {}
    public static bool IsValidPassword(string password) {
        // Check minimum length
        if (password.Length < MIN_LENGTH)
        {
            return false;
        }
        // Check for at least one digit
        if (!password.Any(char.IsDigit))
        {
            return false;
        }
        // Check for at least one uppercase letter
        if (!password.Any(char.IsUpper))
        {
            return false;
        }
        // Check for at least one lowercase letter
        if (!password.Any(char.IsLower))
        {
            return false;
        }
        // Check for at least one symbol
        if (!password.Any(IsSymbol))
        {
            return false;
        }
        return true;
    }

    internal static string? GenerateRandomPassword()
    {
        throw new NotImplementedException();
    }

    private static bool IsSymbol(char c)
    {
         // You can customize the symbols as needed
        string symbols = "!@#$%^&*()-_=+[]{}|;:'\"<>,.?/";
        return symbols.Contains(c);
       }
    }

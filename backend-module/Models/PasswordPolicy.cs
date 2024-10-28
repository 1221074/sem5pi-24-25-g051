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

    public static string GenerateRandomPassword()
    {
       //created a uniquely has password that contains a 1 uppercase, 1 lowercase, 1 digit and one symbol
        string password = "";
        Random random = new Random();
        string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        string lower = "abcdefghijklmnopqrstuvwxyz";
        string digit = "0123456789";
        string symbol = "!@#$%^&*()-_=+[]{}|;:'\"<>,.?/";
        password += upper[random.Next(upper.Length)];
        password += lower[random.Next(lower.Length)];
        password += digit[random.Next(digit.Length)];
        password += symbol[random.Next(symbol.Length)];
        for (int i = 4; i < MIN_LENGTH; i++)
        {
            string chars = upper + lower + digit + symbol;
            password += chars[random.Next(chars.Length)];
        }
        return password; 
    }

    private static bool IsSymbol(char c)
    {
         // You can customize the symbols as needed
        string symbols = "!@#$%^&*()-_=+[]{}|;:'\"<>,.?/";
        return symbols.Contains(c);
       }
    }

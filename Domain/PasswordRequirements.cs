using System.Text.RegularExpressions;

namespace sem5pi_24_25_g051.Domain;
public class PasswordRequirements
{
        public bool validatePassword(string password)
    {
        if (string.IsNullOrEmpty(password) || password.Length < 10)
        {
            return false; 
        }

        if (!Regex.IsMatch(password, @"\d")) // at least one digit
        {
            return false;
        }

        if (!Regex.IsMatch(password, @"[A-Z]")) // at least one capital letter
        {
            return false;
        }

        if (!Regex.IsMatch(password, @"[^a-zA-Z0-9]")) // at least one special character
        {
            return false;
        }

        return true; // password meets all requirements
    }
}
using System;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Models.User;
public class UserNif  {
        private const int PORTUGUESE_NIF_SIZE = 9;

        [Key]
        public string Value { get; private set; }

        protected UserNif() {}

        // This is a very simple implementation of a NIF validation, in a real world cenario there should be validators
        // for each country
        public UserNif(string nif)
        {
            // Check if nif is null or empty
            if (string.IsNullOrEmpty(nif))
            {
                throw new ArgumentNullException(nameof(nif));
            }

           // Check if nif has valid size
            if (nif.Length != PORTUGUESE_NIF_SIZE)
            {
                throw new ArgumentException("NIF must be have 9 characters");
            }

            int digitsSum = 0;
            for (int i = 0; i < nif.Length - 1; i++)
            {
                // Multiplies the 1st digit by 9, the 2nd by 8, the 3rd by 7 and so on and so on
                digitsSum += (int)char.GetNumericValue(nif[i]) * (nif.Length - i);
            }

            // Calculates the check digit according to the Portuguese NIF rules.
            int checkDigit = 11 - digitsSum % 11;

            // If it is greater than 10, the check digit is 0.
            if (checkDigit >= 10)
            {
                checkDigit = 0;
            }

            // Checks if the check digit is the same as the last digit of the NIF.
            if (checkDigit != (int)char.GetNumericValue(nif[^1]))
            {
                throw new ArgumentException("NIF is invalid according to Portuguese rules!");
            }

            Value = nif;
        }
}
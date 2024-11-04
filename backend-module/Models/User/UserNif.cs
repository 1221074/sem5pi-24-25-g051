using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using backend_module.Models.Shared;

namespace backend_module.Models.User
{
    public class UserNif : EntityId
    {
        private const int PORTUGUESE_NIF_SIZE = 8;

        // Constructor using string value
      public UserNif(string value) : base(value)
        {
        }

        private void ValidateNif(string value)
        {
            // Check if NIF is null or empty
            if (string.IsNullOrEmpty(value))
            {
                throw new ArgumentNullException(nameof(value));
            }

            // Check if NIF has valid size
            if (value.Length != PORTUGUESE_NIF_SIZE)
            {
                throw new ArgumentException("NIF must have 9 characters.");
            }

            int digitsSum = 0;
            for (int i = 0; i < value.Length - 1; i++)
            {
                digitsSum += (int)char.GetNumericValue(value[i]) * (value.Length - i);
            }

            // Calculate the check digit according to the Portuguese NIF rules
            int checkDigit = 11 - digitsSum % 11;
            if (checkDigit >= 10) checkDigit = 0;

            // Check if the check digit is the same as the last digit of the NIF
            if (checkDigit != (int)char.GetNumericValue(value[^1]))
            {
                throw new ArgumentException("NIF is invalid according to Portuguese rules!");
            }
        }

        override
        public string AsString()
        {
            return base.ObjValue.ToString();
        }

          override
        protected Object createFromString(String text){
            // Directly return the string or apply validation as needed
            if (string.IsNullOrEmpty(text) && text.Length != PORTUGUESE_NIF_SIZE)
            {
                throw new ArgumentException("Invalid NIF format");
            }
            return text;
        }
      
    }
}

using System;

namespace sem5pi_24_25_g051.Models;

    public class UserRole 
    {
        public RoleType Type { get; private set; }

        public string RoleId { get; private set; }

        protected UserRole() {}

        public UserRole(string roleID, RoleType roleType)
        {
            // Check if roleId is null or empty
            if (string.IsNullOrEmpty(roleID))
            {
                throw new ArgumentNullException(nameof(roleID));
            }

            Type = roleType;
            RoleId = roleID;
        }
    }

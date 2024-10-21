using System;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.User;


namespace sem5pi_24_25_g051.Models.User
{
    public class UserMapper
    {
        public static User toEntity(CreatingUserDTO dto)
        {
            return new User(new UserNif(dto.Nif),dto.Email, dto.UserName, dto.PhoneNumber, dto.Role);
        }

        public static UserDto toDTO(User OT)
        {
            return new UserDto(OT.Nif.Value, OT.Email, OT.Username, OT.Phone, OT.Role);
        }
    }
}
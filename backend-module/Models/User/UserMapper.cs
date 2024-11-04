using System;
using System.Collections.Generic;
using backend_module.Models.User;


namespace backend_module.Models.User
{
    public class UserMapper
    {
        public static UserDto toEntity(CreatingUserDTO dto)
        {
            return new UserDto(dto.Email, dto.UserName, dto.PhoneNumber, dto.Role);
        }

        public static UserDto toDTO(User OT)
        {
            return new UserDto(OT.Id.Value, OT.Email, OT.Username, OT.Phone, OT.Role);
        }
    }
}
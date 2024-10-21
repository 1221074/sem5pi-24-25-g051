using System;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Staff;

namespace sem5pi_24_25_g051.Models.Staff
{
    public class StaffMapper
    {
        public static StaffDto toDTO(CreatingStaffDto dto)
        {
            return new StaffDto(dto.FirstName, dto.LastName, dto.FullName, dto.Specialization, dto.Email, dto.Phone/*, dto.AvailabilitySlots*/);
        }

        public static StaffDto toDTO(Staff staff)
        {
            return new StaffDto(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.Specialization, staff.Email, staff.Phone/*, staff.AvailabilitySlots*/);
        }
    }
}
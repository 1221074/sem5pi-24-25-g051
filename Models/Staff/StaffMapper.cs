using System;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.Specialization;

namespace sem5pi_24_25_g051.Models.Staff
{
    public class StaffMapper
    {
        /*public static StaffDto toDTO(CreatingStaffDto dto)
        {
            return new StaffDto(dto.FirstName, dto.LastName, dto.FullName, new Specialization(dto.SpecializationName), dto.Email, dto.Phone/*, dto.AvailabilitySlots);
        }*/

        public static StaffDto toDTO(Staff staff)
        {
            return new StaffDto(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.SpecializationName, staff.Email, staff.Phone/*, staff.AvailabilitySlots*/);
        }
    }
}
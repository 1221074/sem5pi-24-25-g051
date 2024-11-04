using System;
using System.Collections.Generic;
using backend_module.Models.Staff;
using backend_module.Models.Specialization;

namespace backend_module.Models.Staff
{
    public class StaffMapper
    {
        /*public static StaffDto toDTO(CreatingStaffDto dto)
        {
            return new StaffDto(dto.FirstName, dto.LastName, dto.FullName, new Specialization(dto.SpecializationName), dto.Email, dto.Phone/*, dto.AvailabilitySlots);
        }*/

        public static StaffDto toDTO(Staff staff)
        {
            return new StaffDto(staff.Id.AsGuid(), staff.FirstName, staff.LastName, staff.FullName, staff.SpecializationId, staff.Email, staff.Phone/*, staff.AvailabilitySlots*/);
        }
    }
}
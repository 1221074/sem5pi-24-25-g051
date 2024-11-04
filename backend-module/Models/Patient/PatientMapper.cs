using System;
using System.Collections.Generic;
using backend_module.Models.Patient;


namespace backend_module.Models.Patient
{
    public class PatientMapper
    {
        public static PatientDTO toDTO(CreatingPatientDTO dto)
        {
            return new PatientDTO(dto.FirstName, dto.LastName, dto.FullName, dto.BirthDate, dto.Sex, dto.Email, dto.Phone, dto.EmergencyContact, dto.AppointmentList, dto.AllergyList);
        }

        public static PatientDTO toDTO(Patient OT)
        {
            return new PatientDTO(OT.Id.AsGuid(), OT.FirstName, OT.LastName, OT.FullName, OT.BirthDate, OT.Sex, OT.Email, OT.Phone, OT.EmergencyContact, OT.AppointmentList, OT.AllergyList);
        }
    }
}
/*using System;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Patient;


namespace sem5pi_24_25_g051.Models.Patient
{
    public class PatientMapper
    {
        public static PatientDTO toDTO(CreatingPatientDTO dto)
        {
            return new PatientDTO(dto.FirstName, dto.LastName, dto.FullName, dto.BirthDate, dto.Sex, dto.AllergyList);
        }

        public static PatientDTO toDTO(Patient OT)
        {
            return new PatientDTO(OT.Id.AsGuid(),OT.FirstName,OT.LastName,OT.FullName, OT.BirthDate, OT.Sex, OT.AllergyList);
        }
    }
}*/
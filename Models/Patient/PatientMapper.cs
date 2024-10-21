using System;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Patient;


namespace sem5pi_24_25_g051.Models.Patient
{
    public class PatientMapper
    {
        public static PatientDTO toDTO(CreatingPatientDTO dto)
        {
            return new PatientDTO(dto.Name);
        }

        public static PatientDTO toDTO(Patient OT)
        {
            return new PatientDTO(OT.Id.AsGuid(), OT.FullName);
        }
    }
}
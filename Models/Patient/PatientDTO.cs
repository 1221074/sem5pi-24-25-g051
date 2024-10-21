using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace sem5pi_24_25_g051.Models.Patient
{
    public class PatientDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public PatientDTO( Guid id,string name)
        {
            Id = id;
            Name = name;
        }
        public PatientDTO(string name)
        {
            Name = name;
        }

        public PatientDTO()
        {
        }
        
    }
}
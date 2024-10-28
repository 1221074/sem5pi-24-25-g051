using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Specialization
{
    public class Specialization : Entity<SpecializationId>
    {
    
        public string SpecializationName { get; set; }
        
        public Specialization(string specializationName)
        {
            this.Id = new SpecializationId(Guid.NewGuid());
            this.SpecializationName = specializationName;   
        }

        public void EditSpecialization(string specializationName)
        {
            this.SpecializationName = specializationName; //pq q isto n dá erro??????
        }

    }
}
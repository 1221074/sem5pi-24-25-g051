using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Specialization
{
    public class Specialization : Entity<SpecializationId>
    {
        [Required]
        public string SpecializationName { get; set; }
        
        private Specialization(string specializationName)
        {
            this.Id = new SpecializationId(Guid.NewGuid());
            this.SpecializationName = specializationName;   
        }

        public void EditSpecialization(Specialization specializationName)
        {
            this.SpecializationName = specializationName.SpecializationName; //pq q isto n dá erro??????
        }

    }
}
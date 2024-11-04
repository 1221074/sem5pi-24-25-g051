using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend_module.Models.Shared;

namespace backend_module.Models.Specialization
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
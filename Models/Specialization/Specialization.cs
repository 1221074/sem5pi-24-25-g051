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
        public string Name { get; set; }
        
        private Specialization(string name)
        {
            this.Name = name;   
        }

    }
}
using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationType
    {
       [Key]
       public int Id { get; set; } 
       [Required]
       public required string Name { get; set; } 
       [Required]
       public required TimeSpan EstimatedDuration { get; set; } 
    
        //public List<SpecializationRequirement> RequiredStaffBySpecialization { get; set; }
       

    }
}

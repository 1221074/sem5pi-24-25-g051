using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.OperationType
{
    public class OperationType
    {
       public int Id { get; set; } 
       public string Name { get; set; } 
       public List<SpecializationRequirement> RequiredStaffBySpecialization { get; set; }
       public TimeSpan EstimatedDuration { get; set; } 
    }
}

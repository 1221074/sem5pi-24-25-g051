using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.OpenApi.Writers;

namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationTypeDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Guid> RequiredStaff { get; set; }

        public string Duration { get; set; }



        public OperationTypeDTO( Guid id,string name, List<Guid> requiredStaff, string duration)
        {
            Id = id;
            Name = name;
            RequiredStaff = requiredStaff;
            Duration = duration;
        }
        
        public OperationTypeDTO(string name, List<Guid> requiredStaff, string duration)
        {
            Name = name;
            RequiredStaff = requiredStaff;
            Duration = duration;
        }

        public OperationTypeDTO()
        {
        }
        
    }
}
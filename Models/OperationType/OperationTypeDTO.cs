using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationTypeDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<string> RequiredStaff { get; set; }

        public string Duration { get; set; }



        public OperationTypeDTO( string id,string name, List<string> requiredStaff, string duration)
        {
            Id = id;
            Name = name;
            RequiredStaff = requiredStaff;
            Duration = duration;
        }
        
        public OperationTypeDTO(string name, List<string> requiredStaff, string duration)
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
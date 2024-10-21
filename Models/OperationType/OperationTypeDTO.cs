using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationTypeDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }


        public OperationTypeDTO( string id,string name, string description)
        {
            Id = id;
            Name = name;
            Description = description;
        }
        public OperationTypeDTO(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public OperationTypeDTO()
        {
        }
        
    }
}
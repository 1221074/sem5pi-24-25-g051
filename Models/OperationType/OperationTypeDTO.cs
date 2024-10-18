using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationTypeDTO
    {
        [NotMapped]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        
    }
}
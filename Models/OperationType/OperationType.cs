using System;
using Microsoft.OpenApi.Models;
using System.ComponentModel.DataAnnotations;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.OperationType
{
    public class OperationType : Entity<OperationTypeId>
    {

        public string Name { get; private set; }
        public string Description { get;  private set; }

        public bool Active{ get;  private set; }

        private OperationType()
        {
            this.Active = true;
        }
        

        public OperationType(string name, string description)
        {
            this.Id = new OperationTypeId(Guid.NewGuid());
            this.Name = name;
            this.Description = description;
            this.Active = true;
        }

        public void ChangeDescription(string name ,string description)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive category.");
            this.Name = name;
            this.Description = description;
        }
        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}
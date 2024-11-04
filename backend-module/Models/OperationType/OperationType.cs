using System;
using Microsoft.OpenApi.Models;
using System.ComponentModel.DataAnnotations;
using backend_module.Models.Shared;
using backend_module.Models.Specialization;

namespace backend_module.Models.OperationType
{
    public class OperationType : Entity<OperationTypeId>
    {

        public string Name { get; private set; }
        public List<Guid> RequiredStaff { get;  private set; }

        public string Duration { get;  private set; }

        public bool Active{ get;  private set; }

        private OperationType()
        {
            this.Active = true;
        }
        

        public OperationType(string name, List<Guid> requiredStaff, string duration)
        {
            this.Id = new OperationTypeId(Guid.NewGuid());
            this.Name = name;
            this.RequiredStaff = requiredStaff;
            this.Duration = duration;
            this.Active = true;
        }
        

        public void Change(string name, List<Guid> requiredStaff, string duration)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive category.");
            this.Name = name;
            this.RequiredStaff = requiredStaff;
            this.Duration = duration;
        }
        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}
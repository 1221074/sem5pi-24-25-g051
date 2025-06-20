using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using backend_module.Models.OperationType;
using backend_module.Models.Shared;
using backend_module.Models.User;

namespace backend_module.Models.OperationRequest
{
    public class OperationRequest : Entity<OperationRequestId>
    {   
        [Required]
        public string PatientId { get; set; } 
        [Required]
        public string DoctorId { get; set; } 
        [Required]
        public string OperationTypeId { get; set; } 
        [Required]
        public DateTime DeadlineDate { get; set; } 
        [Required]
        public Priority PriorityState {get; set;}

        public bool Active{ get; set; }

         public OperationRequest(Guid Id,string patientId, string doctorId, string operationTypeId, DateTime deadlineDate, Priority priorityState) 
    {
        this.Id = new OperationRequestId(Id);
        this.PatientId = patientId;
        this.DoctorId = doctorId;
        this.OperationTypeId = operationTypeId;
        this.DeadlineDate = deadlineDate;
        this.PriorityState = priorityState;
        this.Active = false;
    }
     public OperationRequest(string patientId, string doctorId, string operationTypeId, DateTime deadlineDate, Priority priorityState) 
    {
        this.Id = new OperationRequestId(Guid.NewGuid());
        this.PatientId = patientId;
        this.DoctorId = doctorId;
        this.OperationTypeId = operationTypeId;
        this.DeadlineDate = deadlineDate;
        this.PriorityState = priorityState;
        this.Active = false;
    }

        public void MarkAsInative()
        {
            this.Active = false;
        }
        internal void Change(string patientId, string doctorId, string operationTypeId, DateTime deadlineDate, string priorityState)
        {
            this.PatientId = patientId;
            this.DoctorId = doctorId;
            this.OperationTypeId = operationTypeId;
            this.DeadlineDate = deadlineDate;
            this.PriorityState = (Priority)Enum.Parse(typeof(Priority), priorityState);
        }
    }


    }



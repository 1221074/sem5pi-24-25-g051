using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.User;

namespace sem5pi_24_25_g051.Models.OperationRequest
{
    public class OperationRequest : Entity<OperationRequestId>
    {   
        [Required]
        public int PatientId { get; set; } 
        [Required]
        public int DoctorId { get; set; } 
        [Required]
        public int OperationTypeId { get; set; } 
        [Required]
        public DateTime DeadlineDate { get; set; } 
        [Required]
        public Priority PriorityState {get; set;}

        public bool Active{ get;  private set; }
     public OperationRequest(int patientId, int doctorId, int operationTypeId, DateTime deadlineDate, Priority priorityState) 
    {
        this.Id = new OperationRequestId(Guid.NewGuid());
        this.PatientId = patientId;
        this.DoctorId = doctorId;
        this.OperationTypeId = operationTypeId;
        this.DeadlineDate = deadlineDate;
        this.PriorityState = priorityState;
        this.Active = true;  // Setting default value for Active
    }

        public void MarkAsInative()
        {
            this.Active = false;
        }
        internal void Change(int patientId, int doctorId, int operationTypeId, DateTime deadlineDate, string priorityState)
        {
            this.PatientId = patientId;
            this.DoctorId = doctorId;
            this.OperationTypeId = operationTypeId;
            this.DeadlineDate = deadlineDate;
            this.PriorityState = (Priority)Enum.Parse(typeof(Priority), priorityState);
        }
    }


    }



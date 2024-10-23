using System;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Models.OperationRequest
{
    public class OperationRequestDto
    {
        public Guid Id {get;set;}

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int DoctorId { get; set; }

        [Required]
        public int OperationTypeId { get; set; }

        [Required]
        public DateTime DeadlineDate { get; set; }

        [Required]
        public string PriorityState { get; set; }  // Using string to represent the enum values

        public OperationRequestDto(Guid id, int patientId, int doctorId, int operationTypeId, DateTime deadlineDate, string priorityState)
        {
            Id = id;
            PatientId = patientId;
            DoctorId = doctorId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            PriorityState = priorityState;
        }

        public OperationRequestDto(int patientId, int doctorId, int operationTypeId, DateTime deadlineDate, string priorityState)
        {
            PatientId = patientId;
            DoctorId = doctorId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            PriorityState = priorityState;
        }

        public OperationRequestDto()
        {
        }        
    
    }
}

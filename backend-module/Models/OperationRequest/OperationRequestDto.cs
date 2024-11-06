using System;
using System.ComponentModel.DataAnnotations;

namespace backend_module.Models.OperationRequest
{
    public class OperationRequestDto
    {
        public Guid Id {get;set;}

        [Required]
        public string PatientId { get; set; }

        [Required]
        public string DoctorId { get; set; }

        [Required]
        public string OperationTypeId { get; set; }

        [Required]
        public DateTime DeadlineDate { get; set; }

        [Required]
        public string PriorityState { get; set; }

        public OperationRequestDto(Guid id, string patientId, string doctorId, string operationTypeId, DateTime deadlineDate, string priorityState)
        {
            Id = id;
            PatientId = patientId;
            DoctorId = doctorId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            PriorityState = priorityState;
        }

        public OperationRequestDto(string patientId, string doctorId, string operationTypeId, DateTime deadlineDate, string priorityState)
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

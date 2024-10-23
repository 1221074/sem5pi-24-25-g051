using System.ComponentModel.DataAnnotations;


namespace sem5pi_24_25_g051.Models.OperationRequest
{
public class CreatingOperationRequestDto
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
        public string PriorityState { get; set; }  

     public CreatingOperationRequestDto(int patientId, int doctorId, int operationTypeId, DateTime deadlineDate, string priorityState)
        {
            PatientId = patientId;
            DoctorId = doctorId;
            OperationTypeId = operationTypeId;
            DeadlineDate = deadlineDate;
            PriorityState = priorityState;
        }

    }



}
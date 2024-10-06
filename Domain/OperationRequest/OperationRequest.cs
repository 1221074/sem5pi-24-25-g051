using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace sem5pi_24_25_g051.Domain.OperationRequest
{
    public class OperationRequest
    {   
        [Key]
        public int Id { get; set; } 
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

        public enum Priority {
            Elective,
            Urgent,
            ElectiveSurgery, 
            UrgentSurgery, 
            EmergencySurgery
        }


    }

}

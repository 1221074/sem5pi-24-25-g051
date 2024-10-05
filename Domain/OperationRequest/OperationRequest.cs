using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.OperationRequest
{
    public class OperationRequest
    {   
        public int Id { get; set; } 
        public int PatientId { get; set; } 
        public int DoctorId { get; set; } 
        public int OperationTypeId { get; set; } 
        public DateTime DeadlineDate { get; set; } 

        public int Priority {get; set;}

        //priority verification
        public bool IsPriorityValid(int priority){
            if(priority < 1 || priority > 10){
                return false;
            }
            return true;
        }
    }

}

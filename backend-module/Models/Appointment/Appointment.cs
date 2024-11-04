using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace backend_module.Models.Appointment
{
        public enum AppointmentStatus
    {
        Scheduled,
        Completed,
        Canceled
    }
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int RequestId { get; set; }
        [Required]
        public int RoomId { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        [Required]
        [EnumDataType(typeof(AppointmentStatus))]
        public AppointmentStatus Status { get; set; }
        public string? Description { get; set; } 

      /*public bool CanScheduleAppointment(Set<Staff> staffList,Room room, DateTime appointmentTime, TimeSpan estimatedTime){}
        public bool IsOverEstimatedTime(DateTime endTime){}
        private bool AreStaffAvailable(List<Staff> staffList, DateTime appointmentTime, TimeSpan estimatedTime){}
        private bool RoomAvailability(Room room){}
        private bool ValidateStaffSpecializations(List<Staff> staffList){}
        */
    }


}

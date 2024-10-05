using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.Appointment
{
        public enum AppointmentStatus
    {
        Scheduled,
        Completed,
        Canceled
    }
    public class Appointment
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public int RoomId { get; set; }
        public DateTime DateTime { get; set; }
        public AppointmentStatus Status { get; set; }
        public string Description { get; set; } 

      /*public bool CanScheduleAppointment(Set<Staff> staffList,Room room, DateTime appointmentTime, TimeSpan estimatedTime){}
        public bool IsOverEstimatedTime(DateTime endTime){}
        private bool AreStaffAvailable(List<Staff> staffList, DateTime appointmentTime, TimeSpan estimatedTime){}
        private bool RoomAvailability(Room room){}
        private bool ValidateStaffSpecializations(List<Staff> staffList){}
        */
    }


}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.SurgeryRoom
{
    public class SurgeryRoom
    {
        public int RoomNumber { get; set; }
        public RoomType Type { get; set; } 
        public int Capacity { get; set; }
        public List<string> AssignedEquipment { get; set; } 
        public RoomStatus CurrentStatus { get; set; } 
        public List<Maintenance> MaintenanceSlots { get; set; }

       /* public bool CanHostEvent(DateTime eventTime, TimeSpan eventDuration) {}
        public bool IsAvailable(DateTime eventTime, TimeSpan eventDuration){}
        public bool CanScheduleAppointment(List<User> doctors, DateTime eventTime, TimeSpan eventDuration){}
        */
           public enum RoomType
    {
        OperatingRoom,
        ConsultationRoom,
        ICU
    }
    public enum RoomStatus
    {
        Available,
        Occupied,
        UnderMaintenance
    }


    }

    public class Maintenance
    {
        public DateTime StartDate { get; set; }
        public TimeSpan Duration { get; set; }
        public string Description { get; set; }
    }


}

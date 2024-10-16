using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Models.SurgeryRoom
{
    public class SurgeryRoom
    {
        public required int RoomNumber { get; set; }
        public required RoomType Type { get; set; } 
        public required int Capacity { get; set; }
        public List<string>? AssignedEquipment { get; set; } 
        public required RoomStatus CurrentStatus { get; set; } 
        public required List<Maintenance> MaintenanceSlots { get; set; }

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
        public required DateTime StartDate { get; set; }
        public required TimeSpan Duration { get; set; }
        public string? Description { get; set; }
    }


}

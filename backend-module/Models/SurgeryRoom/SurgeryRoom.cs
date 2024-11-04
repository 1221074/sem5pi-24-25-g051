using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend_module.Models.SurgeryRoom
{
    public class SurgeryRoom
    {
        [Key]
        public required int RoomNumber { get; set; }
        [Required]
        public required RoomType Type { get; set; } 
        [Required]
        public required int Capacity { get; set; }
        [Required]
        public List<string>? AssignedEquipment { get; set; } 
        [Required]
        public required RoomStatus CurrentStatus { get; set; } 
        [Required]
        [NotMapped]
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
        [Required]
        public required DateTime StartDate { get; set; }
        [Required]
        public required TimeSpan Duration { get; set; }
        [Required]
        public string? Description { get; set; }
    }


}

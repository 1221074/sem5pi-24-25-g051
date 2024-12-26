using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend_module.Models.Shared;
using backend_module.Models.Staff;
using Microsoft.EntityFrameworkCore;

namespace backend_module.Models.SurgeryRoom
{
    public class SurgeryRoom : Entity<SurgeryRoomId>
    {
        public RoomType Type { get;  set; } 
        public int Capacity { get; set; }        
        public List<string> AssignedEquipment { get; set; } 
        public RoomStatus Status { get; set; }
        public List<string> MaintenanceSlots { get; set; }

        public bool Active { get; set; }
       public SurgeryRoom(string roomNumber, RoomType type, int capacity, List<string> assignedEquipment,RoomStatus status, List<string> maintenanceSlots)
        {
            Id = new SurgeryRoomId(roomNumber);
            Type = type;
            Capacity = capacity;
            AssignedEquipment = assignedEquipment;
            Status =  status;
            MaintenanceSlots = maintenanceSlots;
            Active = false;
        }

         private SurgeryRoom() {
            this.Active = false;
        }

        
      public void MarkAsInactive()
        {
        this.Active = false;
        }

        public void MarkAsActive() {
            this.Active = true;
        }


        public void Change(RoomType type, int capacity, List<string>? assignedEquipment, RoomStatus status, List<string> maintenanceSlots)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive category.");
            Type = type;
            Capacity = capacity;
            AssignedEquipment = assignedEquipment;
            Status = status;
            MaintenanceSlots = maintenanceSlots;
        }

    }
}

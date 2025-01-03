namespace backend_module.Models.SurgeryRoom
{
    public class SurgeryRoomDto
    {
        public string RoomNumber { get; set; }
        public RoomType Type { get; set; }
        public int Capacity { get; set; }
        public List<string>? AssignedEquipment { get; set; }
        public RoomStatus CurrentStatus { get; set; }
        public List<string> MaintenanceSlots { get; set; }

        public SurgeryRoomDto(string roomNumber, RoomType type, int capacity, List<string>? assignedEquipment, RoomStatus currentStatus, List<string> maintenanceSlots)
        {
            RoomNumber = roomNumber;
            Type = type;
            Capacity = capacity;
            AssignedEquipment = assignedEquipment;
            CurrentStatus = currentStatus;
            MaintenanceSlots = maintenanceSlots;
        }

        public SurgeryRoomDto(RoomType type, int capacity, List<string>? assignedEquipment, RoomStatus currentStatus, List<string> maintenanceSlots)
        {
            Type = type;
            Capacity = capacity;
            AssignedEquipment = assignedEquipment;
            CurrentStatus = currentStatus;
            MaintenanceSlots = maintenanceSlots;
        }

        public SurgeryRoomDto(){}   
    }
}
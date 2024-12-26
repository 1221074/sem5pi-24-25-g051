namespace backend_module.Models.SurgeryRoom
{
    public class CreatingSurgeryRoomDto
    {
        public string RoomNumber { get; set; }
        public RoomType Type { get; set; }
        public int Capacity { get; set; }
        public List<string> AssignedEquipment { get; set; }

        public RoomStatus Status { get; set; }
        public List<string> MaintenanceSlots { get; set; }

        public CreatingSurgeryRoomDto(string roomNumber, RoomType type, int capacity, List<string> assignedEquipment, RoomStatus status, List<string> maintenanceSlots)
        {
            RoomNumber = roomNumber;
            Type = type;
            Capacity = capacity;
            AssignedEquipment = assignedEquipment;
            Status = status;
            MaintenanceSlots = maintenanceSlots;
        }

        public CreatingSurgeryRoomDto() { }
    }
}
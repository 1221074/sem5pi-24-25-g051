using System.Collections.Generic;

namespace backend_module.Models.SurgeryRoom
{
    public static class SurgeryRoomMapper
    {
        public static SurgeryRoomDto toEntity(CreatingSurgeryRoomDto surgeryRoom)
        {
            return new SurgeryRoomDto(
                surgeryRoom.Type,
                surgeryRoom.Capacity,
                surgeryRoom.AssignedEquipment,
                surgeryRoom.Status,
                surgeryRoom.MaintenanceSlots
            );
        }

        public static SurgeryRoomDto toDto(SurgeryRoom dto)
        {
            return new SurgeryRoomDto(
                dto.Id.Value,
                dto.Type,
                dto.Capacity,
                dto.AssignedEquipment,
                dto.Status,
                dto.MaintenanceSlots
            );
        }
    }
}
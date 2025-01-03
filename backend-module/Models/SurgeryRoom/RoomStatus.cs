    namespace backend_module.Models.SurgeryRoom
{
    public enum RoomStatus{
        Available,
        Occupied,
        Maintenance
    }

    public static class RoomStatusExtensions
    {
        public static string ToFriendlyString(this RoomStatus status)
        {
            return status switch
            {
                RoomStatus.Available => "Available",
                RoomStatus.Occupied => "Occupied",
                RoomStatus.Maintenance => "Maintenance",
                _ => "Unknown"
            };
        }
    }
}
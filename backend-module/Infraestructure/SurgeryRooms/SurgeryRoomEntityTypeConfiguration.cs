using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend_module.Models.OperationType;
using backend_module.Models.Staff;
using backend_module.Models.SurgeryRoom;

namespace backend_module.Infraestructure.SurgeryRooms
{
    internal class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoom>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoom> builder)
        {
            builder.Property(e => e.Id).HasColumnName("RoomNumber").HasConversion<int>();
            builder.Property(e => e.Status).HasColumnName("CurrentStatus");
            builder.Ignore(e => e.Active); // If this field is not needed
            builder.Ignore(e => e.MaintenanceSlots); // If this field is not needed

        }
    }
}
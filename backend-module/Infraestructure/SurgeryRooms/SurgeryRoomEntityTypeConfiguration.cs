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
            builder.HasKey(b => b.Id);
        }
    }
}
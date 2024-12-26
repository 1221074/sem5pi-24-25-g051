using backend_module.Models.Staff;
using backend_module.Infraestructure.Shared;
using backend_module.Infraestructure;
using backend_module.Models.SurgeryRoom;

namespace backend_module.Infrastructure.Rooms
{
    public class SurgeryRoomRepository : BaseRepository<SurgeryRoom, SurgeryRoomId>, ISurgeryRoomRepository
    {
        public SurgeryRoomRepository(backofficeDbContext context):base(context.SurgeryRoom)
        { 
        }
    }
}
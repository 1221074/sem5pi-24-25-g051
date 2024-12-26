using backend_module.Models.Shared;
using backend_module.Models.Staff;

namespace backend_module.Models.SurgeryRoom
{
    public interface ISurgeryRoomRepository : IRepository<SurgeryRoom, SurgeryRoomId>
    {
    }
}
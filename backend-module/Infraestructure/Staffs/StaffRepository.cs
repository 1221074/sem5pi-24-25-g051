using backend_module.Models.Staff;
using backend_module.Infraestructure.Shared;
using backend_module.Infraestructure;

namespace backend_module.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        public StaffRepository(backofficeDbContext context):base(context.Staff)
        {

        }
    }
}
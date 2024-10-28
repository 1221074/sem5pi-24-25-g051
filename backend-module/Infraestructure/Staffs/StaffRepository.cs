using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Infraestructure.Shared;
using sem5pi_24_25_g051.Infraestructure;

namespace sem5pi_24_25_g051.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        public StaffRepository(backofficeDbContext context):base(context.Staff)
        {

        }
    }
}
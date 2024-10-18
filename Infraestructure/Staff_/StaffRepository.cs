using sem5pi_24_25_g051.Infrastructure.Shared;
using sem5pi_24_25_g051.Models.Staff;

namespace sem5pi_24_25_g051.Infrastructure.Staff_
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        public StaffRepository(backofficeDbContext context):base(context.Staff)
        {

        }
    }
}
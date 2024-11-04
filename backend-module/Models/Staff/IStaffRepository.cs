using backend_module.Models.Shared;

namespace backend_module.Models.Staff
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
    }
}
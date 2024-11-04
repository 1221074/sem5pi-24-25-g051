using System.Threading.Tasks;

namespace backend_module.Models.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}
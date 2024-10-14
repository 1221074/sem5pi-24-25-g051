using System.Threading.Tasks;

namespace sem5pi_24_25_g051.Domain.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}
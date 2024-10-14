using System.Threading.Tasks;
using sem5pi_24_25_g051.Domain.Shared;

namespace sem5pi_24_25_g051.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly backofficeDbContext _context;

        public UnitOfWork(backofficeDbContext context)
        {
            this._context = context;
        }

        public async Task<int> CommitAsync()
        {
            return await this._context.SaveChangesAsync();
        }
    }
}
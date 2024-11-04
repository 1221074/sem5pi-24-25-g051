using System.Threading.Tasks;
using backend_module.Models.Shared;

namespace backend_module.Infraestructure
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
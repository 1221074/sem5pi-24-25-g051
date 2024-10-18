using System.Threading.Tasks;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Infraestructure
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
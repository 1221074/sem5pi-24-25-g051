using backend_module.Infraestructure.Shared;
using backend_module.Infraestructure;
using backend_module.Models.Specialization;

namespace backend_module.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISpecializationRepository
    {
        public SpecializationRepository(backofficeDbContext context):base(context.Specialization)
        {

        }
    }
}
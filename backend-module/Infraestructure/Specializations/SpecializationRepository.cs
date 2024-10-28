using sem5pi_24_25_g051.Infraestructure.Shared;
using sem5pi_24_25_g051.Infraestructure;
using sem5pi_24_25_g051.Models.Specialization;

namespace sem5pi_24_25_g051.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISpecializationRepository
    {
        public SpecializationRepository(backofficeDbContext context):base(context.Specialization)
        {

        }
    }
}
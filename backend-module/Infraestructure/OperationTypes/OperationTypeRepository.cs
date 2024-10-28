using Microsoft.CodeAnalysis;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Infraestructure.Shared;

namespace sem5pi_24_25_g051.Infraestructure.OperationTypes
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {
    
        public OperationTypeRepository(backofficeDbContext context):base(context.OperationType)
        {
           
        }


    }
}
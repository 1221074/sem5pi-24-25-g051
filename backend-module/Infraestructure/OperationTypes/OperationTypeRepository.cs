using Microsoft.CodeAnalysis;
using backend_module.Models.OperationType;
using backend_module.Infraestructure.Shared;

namespace backend_module.Infraestructure.OperationTypes
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {
    
        public OperationTypeRepository(backofficeDbContext context):base(context.OperationType)
        {
           
        }


    }
}
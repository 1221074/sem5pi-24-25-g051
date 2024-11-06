using Microsoft.CodeAnalysis;
using backend_module.Infraestructure.OperationTypes;
using backend_module.Infraestructure.Shared;
using backend_module.Models.OperationRequest;
using backend_module.Models.User;

namespace backend_module.Infraestructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
    
        public OperationRequestRepository(backofficeDbContext context):base(context.OperationRequest)
        {
        }



    }
}
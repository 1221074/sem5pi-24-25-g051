using Microsoft.CodeAnalysis;
using sem5pi_24_25_g051.Infraestructure.OperationTypes;
using sem5pi_24_25_g051.Infraestructure.Shared;
using sem5pi_24_25_g051.Models.OperationRequest;
using sem5pi_24_25_g051.Models.User;

namespace sem5pi_24_25_g051.Infraestructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
    
        public OperationRequestRepository(backofficeDbContext context):base(context.OperationRequest)
        {
        }



    }
}
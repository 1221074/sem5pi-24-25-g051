using backend_module.Models.Shared;

namespace backend_module.Models.OperationRequest
{
    public interface IOperationRequestRepository: IRepository<OperationRequest, OperationRequestId>
    {
    }
}
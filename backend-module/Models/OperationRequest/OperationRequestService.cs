using backend_module.Models.OperationRequest;
using backend_module.Models.OperationType;
using backend_module.Models.Shared;
using backend_module.Models.User;

namespace backend_module.Models.OperationRequest
{
    public class OperationRequestService
    {

        private readonly IOperationRequestRepository _ORrepo;
        private readonly IUnitOfWork _unitOfWork;
        public OperationRequestService(IOperationRequestRepository ORrepo, IUnitOfWork unitOfWork )
        {
            _ORrepo = ORrepo;
            _unitOfWork = unitOfWork;
        }
        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._ORrepo.GetAllAsync();

            List<OperationRequestDto> listDTO = list.ConvertAll(OR => new OperationRequestDto {
                Id = OR.Id.AsGuid(),
                DeadlineDate = OR.DeadlineDate,
                PriorityState = OR.PriorityState.ToString(),
                OperationTypeId = OR.OperationTypeId,
                PatientId = OR.PatientId,
                DoctorId = OR.DoctorId
                });

            return listDTO;
        }

        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var OR = await this._ORrepo.GetByIdAsync(id);

            if (OR == null) {
                return null;
            }

            return OperationRequestMapper.toDTO(OR);
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto requestDto)
        {
            var OR = new OperationRequest(requestDto.PatientId, requestDto.DoctorId, requestDto.OperationTypeId, requestDto.DeadlineDate, (Priority)Enum.Parse(typeof(Priority),requestDto.PriorityState));

            await this._ORrepo.AddAsync(OR);
            await this._unitOfWork.CommitAsync();

            return OperationRequestMapper.toDTO(OR);
        }

        public  async Task<OperationRequestDto> UpdateAsync(OperationRequestDto requestDto)
        {
             var OR = await this._ORrepo.GetByIdAsync(new OperationRequestId(requestDto.Id));    

            if (OR == null) {
                return null;
            }

            OR.Change(requestDto.PatientId,requestDto.DoctorId,requestDto.OperationTypeId,requestDto.DeadlineDate,requestDto.PriorityState);

            await this._unitOfWork.CommitAsync();

            return OperationRequestMapper.toDTO(OR);
        }

        public async Task<OperationRequestDto> DeleteAsync(OperationRequestId id)
        {
             var OR = await this._ORrepo.GetByIdAsync(id);

            if (OR == null) {
                return null;
            }

            if (OR.Active) {
                throw new BusinessRuleValidationException("It is not possible to delete an active operation type.");
            }

            this._ORrepo.Remove(OR);
            await this._unitOfWork.CommitAsync();

            return OperationRequestMapper.toDTO(OR);
        }
    }
}

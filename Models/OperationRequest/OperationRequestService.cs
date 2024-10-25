using sem5pi_24_25_g051.Models.OperationRequest;
using sem5pi_24_25_g051.Models.OperationType;
//using sem5pi_24_25_g051.Models.Patient;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.User;

namespace sem5pi_24_25_g051.Models.OperationRequest
{
    public class OperationRequestService
    {

        private readonly IOperationRequestRepository _ORrepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserService _userService;
        private readonly OperationTypeService _operationTypeService;
        public OperationRequestService(IOperationRequestRepository ORrepo, IUnitOfWork unitOfWork , UserService doctorService, OperationTypeService operationTypeService)
        {
            _ORrepo = ORrepo;
            _unitOfWork = unitOfWork;
            _userService = doctorService;
            _operationTypeService = operationTypeService;
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

       /*   public async Task<UserDto> GetDoctorByIdAsync(string doctorId)
        {
            return await _userService.GetByIdAsync(new UserNif(doctorId));
        }

       public async Task<PatientDto> GetPatientByIdAsync(string patientId)
        {
            return await _patientService.GetPatientByIdAsync(patientId);
        }

        public async Task<OperationTypeDTO> GetOperationTypeByIdAsync(string operationTypeId)
        {
            return await _operationTypeService.GetByIdAsync(new OperationTypeId(operationTypeId));
        }*/
    }
}

using System.Threading.Tasks;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.OperationType {
    public class OperationTypeService {

        private readonly IOperationTypeRepository _OTrepo;
        private readonly IUnitOfWork _unitOfWork;

        public OperationTypeService(IOperationTypeRepository OTrepo, IUnitOfWork unitOfWork) {
            _OTrepo = OTrepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<OperationTypeDTO>> GetAllAsync() {
            var list = await this._OTrepo.GetAllAsync();

            List<OperationTypeDTO> listDTO = list.ConvertAll(OT => new OperationTypeDTO {
                Id = OT.Id.AsGuid().ToString(),
                Name = OT.Name,
                Description = OT.Description
            });

            return listDTO;
        }
        
        public async Task<OperationTypeDTO> GetByIdAsync(OperationTypeId id) {
            
            var OT = await this._OTrepo.GetByIdAsync(id);

            if (OT == null) {
                return null;
            }

            return OperationTypeMapper.toDTO(OT);
        }

        public async Task<OperationTypeDTO> AddAsync(CreatingOperationTypeDTO OTDTO) {
            var OT = new OperationType(OTDTO.Name, OTDTO.Description);

            

            await this._OTrepo.AddAsync(OT);
            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.toDTO(OT);


        }

        public async Task<OperationTypeDTO> UpdateAsync(OperationTypeDTO OTDTO) {
            var OT = await this._OTrepo.GetByIdAsync(new OperationTypeId(OTDTO.Id));    

            if (OT == null) {
                return null;
            }

            OT.ChangeDescription(OTDTO.Name,OTDTO.Description);

            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.toDTO(OT);
        }

        public async Task<OperationTypeDTO> InactivateAsync(OperationTypeId id) {
            var OT = await this._OTrepo.GetByIdAsync(id);

            if (OT == null) {
                return null;
            }

            OT.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.toDTO(OT);
        }

        public async Task<OperationTypeDTO> DeleteAsync(OperationTypeId id) {
            var OT = await this._OTrepo.GetByIdAsync(id);

            if (OT == null) {
                return null;
            }

            if (OT.Active) {
                throw new BusinessRuleValidationException("It is not possible to delete an active operation type.");
            }

            this._OTrepo.Remove(OT);
            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.toDTO(OT);

        }
    }

}
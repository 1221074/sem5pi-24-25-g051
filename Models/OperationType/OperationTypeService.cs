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

            List<OperationTypeDTO> listDTO = new List<OperationTypeDTO>();
            foreach (var OT in list) {
                listDTO.Add(OperationTypeMapper.toDTO(OT));
            }

            return listDTO;
        }
        
        public async Task<OperationTypeDTO> GetByIdAsync(OperationTypeId id) {
            
            var OT = await this._OTrepo.GetByIdAsync(id);

            if (OT == null) {
                return null;
            }

            return OperationTypeMapper.toDTO(OT);
        }

        public async Task<List<OperationTypeDTO>> GetByNameAsync(string name)
        {
            var operationTypes = await this._OTrepo.GetAllAsync();

            List<OperationTypeDTO> dto = new List<OperationTypeDTO>();

            foreach (var ot in operationTypes)
            {
                if (ot.Name == name)
                {
                    dto.Add(OperationTypeMapper.toDTO(ot));
                }
            }
            
            if(operationTypes == null)
                return null;

            return dto;
        }

        public async Task<List<OperationTypeDTO>> GetByStaffAsync(string staff)
        {
            var operationTypes = await this._OTrepo.GetAllAsync();

            List<OperationTypeDTO> dto = new List<OperationTypeDTO>();

            foreach (var ot in operationTypes)
            {
                foreach (var rs in ot.RequiredStaff)
                {
                    if (rs.ToString() == staff)
                {
                    dto.Add(OperationTypeMapper.toDTO(ot));
                }
                }
            }
            
            if(operationTypes == null)
                return null;

            return dto;
        }

        public async Task<List<OperationTypeDTO>> GetByDurationAsync(string duration)
        {
            var operationTypes = await this._OTrepo.GetAllAsync();

            List<OperationTypeDTO> dto = new List<OperationTypeDTO>();

            foreach (var ot in operationTypes)
            {
                if (ot.Duration == duration)
                {
                    dto.Add(OperationTypeMapper.toDTO(ot));
                }
            }
            
            if(operationTypes == null)
                return null;

            return dto;
        }

        public async Task<OperationTypeDTO> AddAsync(CreatingOperationTypeDTO OTDTO) {
            var operationTypes = await this._OTrepo.GetAllAsync();
            if (operationTypes != null){
                List<OperationTypeDTO> list = new List<OperationTypeDTO>();
                foreach (var ot in operationTypes)
                {
                    list.Add(OperationTypeMapper.toDTO(ot));
                }
                foreach (OperationTypeDTO OpT in list)
                {
                    if (OpT.Name == OTDTO.Name)
                    {
                        throw new BusinessRuleValidationException("Operation Type already exists");
                    }
                }
            }
            
            var OT = new OperationType(OTDTO.Name, OTDTO.RequiredStaff, OTDTO.Duration);

            

            await this._OTrepo.AddAsync(OT);
            await this._unitOfWork.CommitAsync();

            return OperationTypeMapper.toDTO(OT);


        }

        public async Task<OperationTypeDTO> UpdateAsync(OperationTypeDTO OTDTO) {
            var OT = await this._OTrepo.GetByIdAsync(new OperationTypeId(OTDTO.Id));    

            if (OT == null) {
                return null;
            }

            OT.Change(OTDTO.Name, OTDTO.RequiredStaff, OTDTO.Duration);

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
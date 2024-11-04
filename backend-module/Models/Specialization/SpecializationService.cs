using System.Threading.Tasks;
using System.Collections.Generic;
using backend_module.Models.Shared;

namespace backend_module.Models.Specialization
{
    public class SpecializationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISpecializationRepository _repo;

        public SpecializationService(IUnitOfWork unitOfWork, ISpecializationRepository repo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        public async Task<List<SpecializationDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<SpecializationDto> listDto = list.ConvertAll(specialization => new SpecializationDto
            {
                Id = specialization.Id.AsGuid(),
                SpecializationName = specialization.SpecializationName,
            });

            return listDto;
        }

        public async Task<SpecializationDto> GetByIdAsync(Guid id)
        {
            var specialization = await this._repo.GetByIdAsync(new SpecializationId(id));
            
            if(specialization == null)
                return null;

            return SpecializationMapper.toDTO(specialization);
        }

        public async Task<SpecializationDto> AddAsync(CreatingSpecializationDto dto)
        {
            var specialization = new Specialization(dto.specializationName);

            await this._repo.AddAsync(specialization);

            await this._unitOfWork.CommitAsync();

            return SpecializationMapper.toDTO(specialization);
        }

        public async Task<SpecializationDto> UpdateAsync(SpecializationDto dto)
        {
            var specialization = await this._repo.GetByIdAsync(new SpecializationId(dto.Id));    

            if (specialization == null) {
                return null;
            }

            specialization.EditSpecialization(dto.SpecializationName);

            await this._unitOfWork.CommitAsync();

            return SpecializationMapper.toDTO(specialization);
        }

        public async Task<SpecializationDto> DeleteAsync(SpecializationId id)
        {
            var specialization = await this._repo.GetByIdAsync(id); 

            if (specialization == null)
                return null;   

            this._repo.Remove(specialization);
            await this._unitOfWork.CommitAsync();

            return SpecializationMapper.toDTO(specialization);
        }
    }
}

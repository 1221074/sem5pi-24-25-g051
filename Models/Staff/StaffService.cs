using System.Threading.Tasks;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Staff
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repo;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo)
        {
            _unitOfWork = unitOfWork;
            _repo = repo;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<StaffDto> listDto = list.ConvertAll(staff => new StaffDto
            {
                Id = staff.Id.AsGuid(),
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                Specialization = staff.SpecializationName,
                Email = staff.Email,
                Phone = staff.Phone,
                //AvailabilitySlots = staff.AvailabilitySlots
            });

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);
            
            if(staff == null)
                return null;

            return StaffMapper.toDTO(staff);
        }

        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            var staff = new Staff(dto.FirstName, dto.LastName, dto.FullName, dto.Specialization, dto.Email, dto.Phone/*, dto.AvailabilitySlots*/);

            await this._repo.AddAsync(staff);

            await this._unitOfWork.CommitAsync();

            return StaffMapper.toDTO(staff);
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {
            var staff = await this._repo.GetByIdAsync(new StaffId(dto.Id));    

            if (staff == null) {
                return null;
            }

            staff.EditStaffProfile(dto.FirstName, dto.LastName, dto.FullName, dto.Specialization, dto.Email, dto.Phone/*, dto.AvailabilitySlots*/);

            await this._unitOfWork.CommitAsync();

            return StaffMapper.toDTO(staff);
        }

        public async Task<StaffDto> InactivateAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id); 

            if (staff == null)
                return null;   

            staff.MarkAsInactive();
            
            await this._unitOfWork.CommitAsync();

            return StaffMapper.toDTO(staff);
        }

        public async Task<StaffDto> DeleteAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id); 

            if (staff == null)
                return null;   

            if (staff.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active staff.");
            
            this._repo.Remove(staff);
            await this._unitOfWork.CommitAsync();

            return StaffMapper.toDTO(staff);
        }
    }
}

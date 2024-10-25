using System.Threading.Tasks;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.Specialization;

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
            List<StaffDto> listDto = new List<StaffDto>();
            foreach (var s in list)
            {
                listDto.Add(StaffMapper.toDTO(s));
            }

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);
            
            if(staff == null)
                return null;

            return StaffMapper.toDTO(staff);
        }

        public async Task<List<StaffDto>> GetByFirstNameAsync(string name)
        {
            var staff = await this._repo.GetAllAsync();

            List<StaffDto> dto = new List<StaffDto>();

            foreach (var s in staff)
            {
                if (s.FirstName == name)
                {
                    dto.Add(StaffMapper.toDTO(s));
                }
            }
            
            if(staff == null)
                return null;

            return dto;
        }

        public async Task<List<StaffDto>> GetByLastNameAsync(string name)
        {
            var staff = await this._repo.GetAllAsync();

            List<StaffDto> dto = new List<StaffDto>();

            foreach (var s in staff)
            {
                if (s.LastName == name)
                {
                    dto.Add(StaffMapper.toDTO(s));
                }
            }
            
            if(staff == null)
                return null;

            return dto;
        }

        public async Task<List<StaffDto>> GetByFullNameAsync(string name)
        {
            var staff = await this._repo.GetAllAsync();

            List<StaffDto> dto = new List<StaffDto>();

            foreach (var s in staff)
            {
                if (s.FullName == name)
                {
                    dto.Add(StaffMapper.toDTO(s));
                }
            }
            
            if(staff == null)
                return null;

            return dto;
        }

        public async Task<StaffDto> GetByEmailAsync(string email)
        {
            var staff = await this._repo.GetAllAsync();

            StaffDto dto = new StaffDto();

            foreach (var s in staff)
            {
                if (s.Email == email)
                {
                    dto = StaffMapper.toDTO(s);
                }
            }
            
            if(staff == null)
                return null;

            return dto;
        }

        public async Task<StaffDto> GetByPhoneAsync(string phone)
        {
            var staff = await this._repo.GetAllAsync();

            StaffDto dto = new StaffDto();

            foreach (var s in staff)
            {
                if (s.Phone == phone)
                {
                    dto = StaffMapper.toDTO(s);
                }
            }
            
            if(staff == null)
                return null;

            return dto;
        }

        public async Task<List<StaffDto>> GetBySpecializationAsync(Guid specId)
        {
            var staff = await this._repo.GetAllAsync();

            List<StaffDto> dto = new List<StaffDto>();

            foreach (var s in staff)
            {
                if (s.SpecializationId == specId)
                {
                    dto.Add(StaffMapper.toDTO(s));
                }
            }
            
            if(staff == null)
                return null;

            return dto;
        }

        public async Task<StaffDto> AddAsync(StaffDto dto)
        {
    
            var staff = new Staff(dto.FirstName, dto.LastName, dto.FullName, dto.SpecializationId, dto.Email, dto.Phone/*, dto.AvailabilitySlots*/);

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

            staff.EditStaffProfile(dto.FirstName, dto.LastName, dto.FullName, dto.SpecializationId, dto.Email, dto.Phone/*, dto.AvailabilitySlots*/);

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

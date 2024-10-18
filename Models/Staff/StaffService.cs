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
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<StaffDto> listDto = list.ConvertAll(staff => new StaffDto
            {
                Id = staff.Id,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber,
                Specialization = staff.Specialization,
                Email = staff.Email,
                Phone = staff.Phone,
                AvailabilitySlots = staff.AvailabilitySlots
            });

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(string id)
        {
            var staffId = new StaffId(id);
            var staff = await this._repo.GetByIdAsync(staffId);
            
            if(staff == null)
                return null;

            return new StaffDto
            {
                Id = staff.Id,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber,
                Specialization = staff.Specialization,
                Email = staff.Email,
                Phone = staff.Phone,
                AvailabilitySlots = staff.AvailabilitySlots
            };
        }

        public async Task<StaffDto> AddAsync(StaffDto dto)
        {
            var staff = new Staff(dto.FirstName, dto.LastName, dto.FullName, dto.LicenseNumber, dto.Specialization, dto.Email, dto.Phone, dto.AvailabilitySlots);

            await this._repo.AddAsync(staff);

            await this._unitOfWork.CommitAsync();

            return new StaffDto
            {
                Id = staff.Id,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber,
                Specialization = staff.Specialization,
                Email = staff.Email,
                Phone = staff.Phone,
                AvailabilitySlots = staff.AvailabilitySlots
            };
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {
            var staffId = new StaffId(dto.Id.ToString());
            var staff = await this._repo.GetByIdAsync(staffId); 

            if (staff == null)
                return null;   

            // Update fields
            staff.FirstName = dto.FirstName;
            staff.LastName = dto.LastName;
            //staff.FullName = dto.FullName;
            staff.LicenseNumber = dto.LicenseNumber;
            staff.Specialization = dto.Specialization;
            staff.Email = dto.Email;
            staff.Phone = dto.Phone;
            staff.AvailabilitySlots = dto.AvailabilitySlots;
            
            await this._unitOfWork.CommitAsync();

            return new StaffDto
            {
                Id = staff.Id,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber,
                Specialization = staff.Specialization,
                Email = staff.Email,
                Phone = staff.Phone,
                AvailabilitySlots = staff.AvailabilitySlots
            };
        }

        public async Task<StaffDto> InactivateAsync(string id)
        {
            var staffId = new StaffId(id);
            var staff = await this._repo.GetByIdAsync(staffId); 

            if (staff == null)
                return null;   

            staff.MarkAsInactive();
            
            await this._unitOfWork.CommitAsync();

            return new StaffDto
            {
                Id = staff.Id,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber,
                Specialization = staff.Specialization,
                Email = staff.Email,
                Phone = staff.Phone,
                AvailabilitySlots = staff.AvailabilitySlots
            };
        }

        public async Task<StaffDto> DeleteAsync(string id)
        {
            var staffId = new StaffId(id);
            var staff = await this._repo.GetByIdAsync(staffId); 

            if (staff == null)
                return null;   

            if (staff.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active staff.");
            
            this._repo.Remove(staff);
            await this._unitOfWork.CommitAsync();

            return new StaffDto
            {
                Id = staff.Id,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber,
                Specialization = staff.Specialization,
                Email = staff.Email,
                Phone = staff.Phone,
                AvailabilitySlots = staff.AvailabilitySlots
            };
        }
    }
}

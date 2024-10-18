using System.Threading.Tasks;
using System.Collections.Generic;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.User
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;

        public UserService(IUnitOfWork unitOfWork, IUserRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<UserDto> listDto = list.ConvertAll(user => new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Nif = user.Nif,
                // Exclude Password for security reasons
            });

            return listDto;
        }

        public async Task<UserDto> GetByIdAsync(string id)
        {
            var userId = new UserId(id);
            var user = await this._repo.GetByIdAsync(userId);
            
            if(user == null)
                return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Nif = user.Nif,
                // Exclude Password for security reasons
            };
        }

        public async Task<UserDto> AddAsync(UserDto dto)
        {
            var user = new User(dto.Email, dto.UserName, dto.PhoneNumber, dto.Role, dto.Nif, new UserPassword("password"));

            await this._repo.AddAsync(user);

            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Nif = user.Nif,
                // Exclude Password for security reasons
            };
        }

        public async Task<UserDto> UpdateAsync(UserDto dto)
        {
            var userId = new UserId(dto.Id);
            var user = await this._repo.GetByIdAsync(userId); 

            if (user == null)
                return null;   

            // Update fields
            user.Email = dto.Email;
            user.UserName = dto.UserName;
            user.PhoneNumber = dto.PhoneNumber;
            user.Role = dto.Role;
            user.Nif = dto.Nif;
            // Handle password change securely (e.g., hashing)
            
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Nif = user.Nif,
                // Exclude Password for security reasons
            };
        }

        public async Task<UserDto> InactivateAsync(string id)
        {
            var userId = new UserId(id);
            var user = await this._repo.GetByIdAsync(userId); 

            if (user == null)
                return null;   

            user.MarkAsInactive();
            
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Nif = user.Nif,
                // Exclude Password for security reasons
            };
        }

        public async Task<UserDto> DeleteAsync(string id)
        {
            var userId = new UserId(id);
            var user = await this._repo.GetByIdAsync(userId); 

            if (user == null)
                return null;   

            if (user.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active user.");
            
            this._repo.Remove(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Nif = user.Nif,
                // Exclude Password for security reasons
            };
        }
    }
}

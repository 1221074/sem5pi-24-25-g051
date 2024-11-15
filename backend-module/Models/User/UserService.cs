
using backend_module.Models.Shared;
using Google.Apis.Auth;

namespace backend_module.Models.User
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
                Nif = user.Id.Value,
                Email = user.Email,
                UserName = user.Username,
                PhoneNumber = user.Phone,
                Role = user.Role
                });


            return listDto;
        }

        public async Task<UserDto> GetByIdAsync(UserNif id)
        {
            var user = await this._repo.GetByIdAsync(id);
            if(user == null)
                return null;

            return UserMapper.toDTO(user);
        }

        public async Task<UserDto?> GetByEmailAsync(String email){
            List<UserDto> list = await GetAllAsync();
            foreach (UserDto userDto in list){
                if (userDto.Email == email)
                    return userDto;
            }
            return null!;


        }

        public async Task<UserDto> AddAsync(CreatingUserDTO dto)
        {
             // Check if a user with the same email already exists
            var existingUsers = await this._repo.GetAllAsync();
            foreach (var existingUser in existingUsers) {
            if (existingUser.Email == dto.Email)
            {
                throw new Exception("User with the same email already exists");
            }
        }

            var user = new User(dto.Email, dto.UserName, dto.PhoneNumber, dto.Role,dto.Nif);

            await this._repo.AddAsync(user);

            await this._unitOfWork.CommitAsync();

            return UserMapper.toDTO(user);
        }

        public async Task<UserDto> UpdateAsync(UserDto dto)
        {
            var user = await this._repo.GetByIdAsync(new UserNif(dto.Nif));    

            if (user == null)
                return null;   

            user.Change(dto.Email,dto.UserName,dto.PhoneNumber,dto.Role);
            user.Active = true;

           await this._unitOfWork.CommitAsync();
           
           return UserMapper.toDTO(user);
        }

        public async Task<UserDto> InactivateAsync(UserNif id)
        {
            var user = await this._repo.GetByIdAsync(id); 

            if (user == null)
                return null;   

            user.MarkAsInactive();
            
            await this._unitOfWork.CommitAsync();

            return UserMapper.toDTO(user);
        }

        public async Task<UserDto> ActivateAsync(UserNif id) {
            var user = await this._repo.GetByIdAsync(id); 

            if (user == null)
                return null;   

            user.MarkAsActive();
            
            await this._unitOfWork.CommitAsync();

            return UserMapper.toDTO(user);
        }


        public async Task<UserDto> DeleteAsync(UserNif id)
        {
            var user = await this._repo.GetByIdAsync(id); 

            if (user == null)
                return null;   

            if (user.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active user.");
            
            this._repo.Remove(user);
            await this._unitOfWork.CommitAsync();

            return UserMapper.toDTO(user);
        }


    public async Task<GoogleJsonWebSignature.Payload> VerifyGoogleTokenAsync(string idToken)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
            Console.WriteLine("Token validated successfully for email: " + payload.Email);
            return payload;
        }
        catch(Exception ex)
        {
            Console.WriteLine("Token validation failed: " + ex.Message);
            return null; // Return null if the token is invalid
        }
    }

    public async Task<RoleType> GetUserRoleByEmailAsync(string email)
        {
        var user = await GetByEmailAsync(email); // Implement GetByEmailAsync in your UserService
        Console.WriteLine("User role for email " + email + ": " + user.Role);
        return user.Role; // Assuming "Role" is a property of your UserDto
        }
    }

}
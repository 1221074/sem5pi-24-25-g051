using System.Net;
using System.Net.Mail;
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

        public async Task<UserDto> AddAsync(CreatingUserDTO dto)
        {
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

        public Task SendEmailAsync(string toEmail, string subject, string body)
        {
        var mail = "porfavor@isep.ipp.pt";  // Your real Gmail address
        var password = "1234"; // The generated App Password

        var smtpClient = new SmtpClient("dei.isep.ipp.pt", 25)
        {
            EnableSsl = false,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(mail, password),
        };

        var mailMessage = new MailMessage(mail, toEmail, subject, body);
        return smtpClient.SendMailAsync(mailMessage);
        }
    }
}

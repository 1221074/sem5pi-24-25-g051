using Microsoft.CodeAnalysis;
using sem5pi_24_25_g051.Infraestructure.Shared;
using sem5pi_24_25_g051.Models.User;

namespace sem5pi_24_25_g051.Infraestructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
    
        public UserRepository(backofficeDbContext context):base(context.Users)
        {
        
        }


    }
}
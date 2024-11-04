using Microsoft.CodeAnalysis;
using backend_module.Infraestructure.Shared;
using backend_module.Models.User;

namespace backend_module.Infraestructure.Users
{
    public class UserRepository : BaseRepository<User, UserNif>, IUserRepository
    {
        public UserRepository(backofficeDbContext context):base(context.Users)
        {
        }



    }
}
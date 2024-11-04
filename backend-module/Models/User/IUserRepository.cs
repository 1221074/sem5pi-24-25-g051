using backend_module.Models;
using backend_module.Models.Shared;


namespace backend_module.Models.User
{
    public interface IUserRepository:IRepository<User,UserNif> {}
}
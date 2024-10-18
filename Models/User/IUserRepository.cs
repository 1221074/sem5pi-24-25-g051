using sem5pi_24_25_g051.Models;
using sem5pi_24_25_g051.Models.Shared;


namespace sem5pi_24_25_g051.Models.User
{
    public interface IUserRepository:IRepository<User,UserId> {}
}
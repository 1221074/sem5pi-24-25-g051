using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sem5pi_24_25_g051.Models.User;

namespace sem5pi_24_25_g051.Infraestructure.Users
{
    internal class UserTypeEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
           builder.HasKey(b => b.Id);
            // Configure the Id property to convert UserNif to string and vice versa
        }
    }
}
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend_module.Models.User;

namespace backend_module.Infraestructure.Users
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
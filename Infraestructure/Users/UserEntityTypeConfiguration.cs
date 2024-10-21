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
            builder.Property(b => b.Id)
                   .HasConversion(
                       v => v.Value,           
                       v => new UserId(v))      
                   .HasColumnName("Nif");        

            builder.Property(b => b.Email).IsRequired();
            builder.Property(b => b.Username).IsRequired();
            builder.Property(b => b.Phone).IsRequired();
            builder.Property(b => b.Role).IsRequired();
            builder.Property(b => b.Password).IsRequired();
            builder.Property(b => b.Active).IsRequired();
        }
    }
}
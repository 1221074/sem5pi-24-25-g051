using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Models.Staff;

namespace sem5pi_24_25_g051.Infraestructure.Staff_
{
    internal class StaffEntityTypeConfiguration : IEntityTypeConfiguration<Staff>
    {
        public void Configure(EntityTypeBuilder<Staff> builder)
        {
            
            //builder.ToTable("Categories", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id).HasConversion(
                v => v.AsGuid(),
                v => new StaffId(v));
            //builder.Property<bool>("_active").HasColumnName("Active");
        }
    }
}
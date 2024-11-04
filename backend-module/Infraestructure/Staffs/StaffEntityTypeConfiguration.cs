using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend_module.Models.OperationType;
using backend_module.Models.Staff;

namespace backend_module.Infraestructure.Staffs
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
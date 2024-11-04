using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend_module.Models.OperationType;

namespace backend_module.Infraestructure.OperationTypes
{
    internal class OperationTypeEntityTypeConfiguration : IEntityTypeConfiguration<OperationType>
    {
        public void Configure(EntityTypeBuilder<OperationType> builder)
        {
            
            //builder.ToTable("Categories", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id).HasConversion(
                v => v.AsGuid(),
                v => new OperationTypeId(v));
        
            
            
        
            //builder.Property<bool>("_active").HasColumnName("Active");
        }
    }
}
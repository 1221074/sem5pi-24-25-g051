using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sem5pi_24_25_g051.Models.OperationType;

namespace sem5pi_24_25_g051.Infraestructure.OperationTypes
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
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Models.Specialization;

namespace sem5pi_24_25_g051.Infraestructure.Specializations
{
    internal class SpecializationEntityTypeConfiguration : IEntityTypeConfiguration<Specialization>
    {
        public void Configure(EntityTypeBuilder<Specialization> builder)
        {
            
            //builder.ToTable("Categories", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id).HasConversion(
                v => v.AsGuid(),
                v => new SpecializationId(v));
            //builder.Property<bool>("_active").HasColumnName("Active");
        }
    }
}
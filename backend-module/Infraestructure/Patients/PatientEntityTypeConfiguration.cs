using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using backend_module.Models.OperationType;
using backend_module.Models.Patient;

namespace backend_module.Infraestructure.Patients
{
    internal class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            
            //builder.ToTable("Categories", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id).HasConversion(
                v => v.AsGuid(),
                v => new PatientId(v));
            //builder.Property<bool>("_active").HasColumnName("Active");
        }
    }
}
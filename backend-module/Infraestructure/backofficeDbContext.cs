using Microsoft.EntityFrameworkCore;
using backend_module.Models.Appointment;
using backend_module.Models.Staff;
using backend_module.Models.SurgeryRoom;
using backend_module.Models.OperationRequest;
using backend_module.Models.OperationType;
using backend_module.Infraestructure.OperationTypes;
using backend_module.Models.User;
using backend_module.Infraestructure.Users;
using backend_module.Infraestructure.Staffs;
using backend_module.Infraestructure.Specializations;
using backend_module.Models.Specialization;
using backend_module.Infraestructure.OperationRequests;
using backend_module.Models.Patient;
using backend_module.Infraestructure.Patients;
using backend_module.Infraestructure.SurgeryRooms;
using System.Text.Json;


namespace backend_module.Infraestructure
{
    public class backofficeDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public backofficeDbContext(DbContextOptions options, IConfiguration configuration) : base(options) {
            _configuration = configuration;
        }
        public DbSet<Appointment> Appointment { get; set; } = default!;
        public DbSet<SurgeryRoom> SurgeryRoom { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Patient> Patients { get; set; }
        public DbSet<OperationRequest> OperationRequest { get; set; } = default!;
        public DbSet<OperationType> OperationType { get; set; } = default!;
        public DbSet<Staff> Staff { get; set; } = default!;
        public DbSet<Specialization> Specialization { get; set; } = default!;

        
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SurgeryRoomEntityTypeConfiguration());

            modelBuilder.Entity<User>()
            .Property(u => u.Id)
            .HasConversion(
                v => v.AsString(), 
                v => new UserNif(v) 
            );
            modelBuilder.Entity<OperationRequest>()
            .Property(u => u.Id)
            .HasConversion(
                v => v.AsGuid(), 
                v => new OperationRequestId(v) 
            );

            modelBuilder.Entity<SurgeryRoom>()
            .Property(u => u.Id)
            .HasConversion(
                v => v.AsString(), 
                v => new SurgeryRoomId(v) 
            );

            modelBuilder.Entity<SurgeryRoom>(builder => {
                builder.Property(e => e.AssignedEquipment)
                    .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()));

            builder.Property(e => e.MaintenanceSlots)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                    v => JsonSerializer.Deserialize<List<string>>(v, new JsonSerializerOptions()));
            builder.Property(e => e.Id)
                .HasColumnType("nvarchar(450)") // Or the appropriate length
                .IsRequired();
            });
            modelBuilder.Entity<OperationType>().ToTable("OperationType");
            modelBuilder.Entity<Staff>().ToTable("Staff");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<OperationRequest>().ToTable("OperationRequest");
            modelBuilder.Entity<Specialization>().ToTable("Specialization");
            modelBuilder.Entity<Patient>().ToTable("Patient");
            modelBuilder.Entity<SurgeryRoom>().ToTable("SurgeryRoom");
}
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));        }
    }
    }
}
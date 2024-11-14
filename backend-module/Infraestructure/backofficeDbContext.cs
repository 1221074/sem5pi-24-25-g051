using Microsoft.EntityFrameworkCore;
using backend_module.Models;
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
using Microsoft.Extensions.Configuration;


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
            //have a keyless entity named Availability Slot
            //modelBuilder.Entity<AvailabilitySlot>().HasNoKey();
            modelBuilder.Entity<Maintenance>().HasNoKey();
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());

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

            

            modelBuilder.Entity<OperationType>().ToTable("OperationType");
            modelBuilder.Entity<Staff>().ToTable("Staff");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<OperationRequest>().ToTable("OperationRequest");
            modelBuilder.Entity<Specialization>().ToTable("Specialization");
            modelBuilder.Entity<Patient>().ToTable("Patient");
}
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(_configuration.GetConnectionString("DefaultConnection"));        }
    }
    }
}
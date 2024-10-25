using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Models;
using sem5pi_24_25_g051.Models.Appointment;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.SurgeryRoom;
using sem5pi_24_25_g051.Models.OperationRequest;
using sem5pi_24_25_g051.Models.OperationType;
using sem5pi_24_25_g051.Infraestructure.OperationTypes;
using sem5pi_24_25_g051.Models.User;
using sem5pi_24_25_g051.Infraestructure.Users;
using sem5pi_24_25_g051.Infraestructure.Staffs;
using sem5pi_24_25_g051.Infraestructure.Specializations;
using sem5pi_24_25_g051.Models.Specialization;
using sem5pi_24_25_g051.Infraestructure.OperationRequests;


namespace sem5pi_24_25_g051.Infraestructure
{
    public class backofficeDbContext : DbContext
    {

        public backofficeDbContext(DbContextOptions options) : base(options) {

        }

        public DbSet<Appointment> Appointment { get; set; } = default!;
        public DbSet<SurgeryRoom> SurgeryRoom { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;
        //public DbSet<Patient> Patients { get; set; }
        public DbSet<OperationRequest> OperationRequest { get; set; } = default!;
        public DbSet<OperationType> OperationType { get; set; } = default!;
        public DbSet<Staff> Staff { get; set; } = default!;
        public DbSet<Specialization> Specialization { get; set; } = default!;


        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        //have a keyless entity named Availability Slot
            //modelBuilder.Entity<AvailabilitySlot>().HasNoKey();
            modelBuilder.Entity<Maintenance>().HasNoKey();
            //modelBuilder.Entity<UserRole>().HasNoKey();
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());

        modelBuilder.Entity<User>()
            .Property(u => u.Id)
            .HasConversion(
                v => v.AsString(), // Convert UserNif to string for storage
                v => new UserNif(v) // Convert string back to UserNif when reading
            );

            

            modelBuilder.Entity<OperationType>().ToTable("OperationType");
            modelBuilder.Entity<Staff>().ToTable("Staff");
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<OperationRequest>().ToTable("OperationRequest");
            modelBuilder.Entity<Specialization>().ToTable("Specialization");
}
    }
}
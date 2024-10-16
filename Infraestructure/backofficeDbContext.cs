using Microsoft.EntityFrameworkCore;
using sem5pi_24_25_g051.Models;
using sem5pi_24_25_g051.Models.Appointment;
using sem5pi_24_25_g051.Models.Staff;
using sem5pi_24_25_g051.Models.SurgeryRoom;
using sem5pi_24_25_g051.Models.OperationRequest;
using sem5pi_24_25_g051.Models.OperationType;


namespace sem5pi_24_25_g051.Infrastructure
{
    public class backofficeDbContext : DbContext
    {

        public backofficeDbContext(DbContextOptions options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        //have a keyless entity named Availability Slot
            modelBuilder.Entity<AvailabilitySlot>().HasNoKey();
            modelBuilder.Entity<Maintenance>().HasNoKey();
            modelBuilder.Entity<UserRole>().HasNoKey();
        }
        public DbSet<Appointment> Appointment { get; set; } = default!;
        public DbSet<Staff> Staff { get; set; } = default!;
        public DbSet<SurgeryRoom> SurgeryRoom { get; set; } = default!;
        public DbSet<User> User { get; set; } = default!;
        public DbSet<Patient> Patients { get; set; }
        public DbSet<OperationRequest> OperationRequest { get; set; } = default!;
        public DbSet<OperationType> OperationType { get; set; } = default!;
    }
}
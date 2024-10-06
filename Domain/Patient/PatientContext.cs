using Microsoft.EntityFrameworkCore;

namespace sem5pi_24_25_g051.Domain.Patient
{
    public class PatientContext : DbContext
    {
        public PatientContext(DbContextOptions<PatientContext> options) : base(options) {}

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

    }
}

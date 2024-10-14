using Microsoft.EntityFrameworkCore;

namespace sem5pi_24_25_g051.Models
{
    public class PatientContext : DbContext
    {
        public PatientContext(DbContextOptions<PatientContext> options) : base(options) {}

        public DbSet<Patient> Patients { get; set; }
    }
}

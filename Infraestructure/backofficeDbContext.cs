using Microsoft.EntityFrameworkCore;


namespace sem5pi_24_25_g051.Infrastructure
{
    public class backofficeDbContext : DbContext
    {

        public backofficeDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        
        
        }
    }
}
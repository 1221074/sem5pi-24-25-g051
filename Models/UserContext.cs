using Microsoft.EntityFrameworkCore;

namespace sem5pi_24_25_g051.Models
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }

        //when you create the model say that UserNif is the only entity that requires a key
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.Nif);
            modelBuilder.Entity<UserPassword>().HasNoKey();
            modelBuilder.Entity<UserRole>().HasNoKey();
        }

    }
}

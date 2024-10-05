using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System;

namespace sem5pi_24_25_g051.Domain.User
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }


        public DbSet<User> Users { get; set; }
    
    }
}



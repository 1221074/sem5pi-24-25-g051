using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sem5pi_24_25_g051.Models.Staff
{
    public class Staff
    {
         [Key]
        public int Id { get; set; }
        [Required]
        public required string FirstName { get; set; } 
        [Required]
        public required string LastName { get; set; } 
        public string FullName => $"{FirstName} {LastName}"; 
        [Required]
        public required string LicenseNumber { get; set; } 
        [Required]
        public required string Specialization { get; set; } 
        [Required]
        public required string Email { get; set; } 
        [Required]
        public required string Phone { get; set; } 
        [Required]
        [NotMapped]
        public required List<AvailabilitySlot> AvailabilitySlots { get; set; } 
    }

    public class AvailabilitySlot
    {
        [Required]
        public required List<DateTime> Slot { get; set; } 
        [Required]
        public required TimeSpan Duration { get; set; } 
    }
}
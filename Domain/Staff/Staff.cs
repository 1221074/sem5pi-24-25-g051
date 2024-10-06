using System;
using System.ComponentModel.DataAnnotations;

namespace sem5pi_24_25_g051.Domain.Staff
{
    public class Staff
    {
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
        public required List<AvailabilitySlot> AvailabilitySlots { get; set; } 
    }

    public class AvailabilitySlot
    {
        public required List<DateTime> Slot { get; set; } 
        public required TimeSpan Duration { get; set; } 
    }
}
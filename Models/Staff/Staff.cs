using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Staff
{
    public class Staff : Entity<StaffId>
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FirstName { get; set; } 
        [Required]
        public string LastName { get; set; } 
        public string FullName => $"{FirstName} {LastName}"; 
        [Required]
        public string LicenseNumber { get; set; } 
        [Required]
        public string Specialization { get; set; } 
        [Required]
        public string Email { get; set; } 
        [Required]
        public string Phone { get; set; } 
        [Required]
        public bool Active { get; set; } = true;
        [Required]
        /*[NotMapped]
        public List<AvailabilitySlot> AvailabilitySlots { get; set; } */

        public Dictionary<DateTime, TimeSpan> Slots { get; set; }

        public void MarkAsInactive()
        {
            this.Active = false;
        }

        public Staff(string firstName, string lastName, string fullName, string licenseNumber, string specialization, string email, string phone, /*List<AvailabilitySlot> availabilitySlots*/ Dictionary<DateTime, TimeSpan> slots)
        {
            FirstName = firstName;
            LastName = lastName;
            LicenseNumber = licenseNumber;
            Specialization = specialization;
            Email = email;
            Phone = phone;
            //AvailabilitySlots = availabilitySlots;
            Slots = slots;
        }

        protected Staff()
        {
        }
    }
    /*
    public class AvailabilitySlot
    {
        [Required]
        public required List<DateTime> Slot { get; set; } 
        [Required]
        public required TimeSpan Duration { get; set; } 
    }*/
}
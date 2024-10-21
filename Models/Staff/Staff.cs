using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sem5pi_24_25_g051.Models.Shared;

namespace sem5pi_24_25_g051.Models.Staff
{
    public class Staff : Entity<StaffId>
    {
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

        private Staff()
        {
            this.Active = true;
        }

        public void MarkAsInactive()
        {
            this.Active = false;
        }

        public Staff(string firstName, string lastName, string fullName, string licenseNumber, string specialization, string email, string phone, /*List<AvailabilitySlot> availabilitySlots*/ Dictionary<DateTime, TimeSpan> slots)
        {
            this.Id = new StaffId(Guid.NewGuid());
            this.FirstName = firstName;
            this.LastName = lastName;
            this.LicenseNumber = licenseNumber;
            this.Specialization = specialization;
            this.Email = email;
            this.Phone = phone;
            //AvailabilitySlots = availabilitySlots;
            this.Slots = slots;
        }

        public void EditStaffProfile(string firstName, string lastName, string fullName, string licenseNumber, string specialization, string email, string phone, /*List<AvailabilitySlot> availabilitySlots*/ Dictionary<DateTime, TimeSpan> slots)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive category.");
            this.FirstName = firstName;
            this.LastName = lastName;
            this.LicenseNumber = licenseNumber;
            this.Specialization = specialization;
            this.Email = email;
            this.Phone = phone;
            //AvailabilitySlots = availabilitySlots;
            this.Slots = slots;
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
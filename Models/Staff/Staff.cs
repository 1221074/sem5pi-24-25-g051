using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sem5pi_24_25_g051.Models.Shared;
using sem5pi_24_25_g051.Models.Specialization;

namespace sem5pi_24_25_g051.Models.Staff
{
    public class Staff : Entity<StaffId>
    {
        [Required]
        public string FirstName { get; set; } 
        [Required]
        public string LastName { get; set; } 
        public string FullName { get; set; } 
        [Required]
        public Specialization.Specialization SpecializationName { get; set; } 
        [Required]
        public string Email { get; set; } 
        [Required]
        public string Phone { get; set; } 
        [Required]
        public bool Active { get; set; } = true;
        /*[Required]
        [NotMapped]
        public List<AvailabilitySlot> AvailabilitySlots { get; set; } */


        private Staff()
        {
            this.Active = true;
        }

        public void MarkAsInactive()
        {
            this.Active = false;
        }

        public Staff(string firstName, string lastName, string fullName, Specialization.Specialization specializationName, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            this.Id = new StaffId(Guid.NewGuid());
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.SpecializationName = specializationName;
            this.Email = email;
            this.Phone = phone;
            //AvailabilitySlots = availabilitySlots;
        }

        public void EditStaffProfile(string firstName, string lastName, string fullName, Specialization.Specialization specializationName, string email, string phone/*, List<AvailabilitySlot> availabilitySlots*/)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change data of an inactive Staff member.");
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.SpecializationName = specializationName;
            this.Email = email;
            this.Phone = phone;
            //AvailabilitySlots = availabilitySlots;
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